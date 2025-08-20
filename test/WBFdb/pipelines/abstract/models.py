from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from uuid import uuid4
from datetime import timedelta

class PIPEAbstractManager(models.Manager):
    def get_object_by_public_id(self, public_id):
        try:
            instance = self.get(public_id=public_id)
            return instance
        except (ObjectDoesNotExist, ValueError, TypeError):
            return Http404

class PIPEAbstractModel(models.Model):

    _owner_related_name: str = "Documentation purposes"     # currently they are deprecated,
    _origin_related_name: str = "Documentation purposes"    # and optional no need to add in the models

    _tracked_fields: list[str]
    """Define which fields should be tracked for new versions in each model.
    Override this in child models."""

    public_id = models.UUIDField(
        db_index=True,
        unique=True,
        default=uuid4,
        editable=False
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='%(class)s_owner',
    )

    originated_from = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='origin_%(class)s',
    )

    is_private = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    version_history = models.JSONField(default=dict, blank=True)
    """Version History Example JSON
    {
        "0": {                      # First commit
            "updated_at": "",
            ...
        },
        "1": {                      # An update
            "updated_at": "",
            ...
        },
        ...
    }
    """

    objects = PIPEAbstractManager()

    class Meta:
        abstract = True

    def _get_field_snapshot(self):
        """Create a snapshot of all versioned fields."""
        snapshot = {}
        for field_name in self._tracked_fields:
            snapshot[field_name] = getattr(self, field_name)

        # Add timestamp
        snapshot['updated_at'] = timezone.now().isoformat()
        return snapshot

    def _initialize_version_history(self):
        """Initialize version history with the first version."""
        if not self.version_history:
            self.version_history = {}

        # Create initial version (version "0")
        if "0" not in self.version_history:
            initial_snapshot = self._get_field_snapshot()
            self.version_history["0"] = initial_snapshot

    def _get_next_version_number(self):
        """Get the next version number as string."""
        if not self.version_history:
            return "0"

        # Find highest version number and increment
        version_numbers = [int(k) for k in self.version_history.keys()]
        return str(max(version_numbers) + 1)

    def _has_tracked_fields_changed(self, old_instance):
        """Check if any versioned fields have changed."""
        for field_name in self._tracked_fields:
            old_value = getattr(old_instance, field_name)
            new_value = getattr(self, field_name)

            if old_value != new_value:
                return True
        return False

    def _create_version_snapshot(self):
        """Manually create a version snapshot."""
        if not self.version_history:
            self.version_history = {}

        version_number = self._get_next_version_number()
        snapshot = self._get_field_snapshot()

        self.version_history[version_number] = snapshot

    def _add_new_version_to_history(self):
        """Create and add a new version to version_history"""
        try:
            old_instance = self.__class__.objects.get(pk=self.pk)

            if self._has_tracked_fields_changed(old_instance):
                # Create new version before saving
                self._create_version_snapshot()

        except self.__class__.DoesNotExist:
            # This shouldn't happen, but handle gracefully
            pass

    def save(self, *args, **kwargs):
        # Check if this is an update to an existing object

        if self.pk is None:
            # For new objects, initialize version history
            super().save(*args, **kwargs)  # Save first to get pk

            self._initialize_version_history()

            # Save again to store version history
            super().save(update_fields=['version_history'])
        else:
            self._add_new_version_to_history()

            # Call the parent save method
            super().save(*args, **kwargs)

    @property
    def is_edited(self):
        """Check if content was edited after creation."""
        if not self.created_at or not self.updated_at:
            return False

        threshold = timedelta(seconds=1)
        return (self.updated_at - self.created_at) > threshold
