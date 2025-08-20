from django.db import models
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from uuid import uuid4
from datetime import timedelta

class WBFAbstractManager(models.Manager):
    def get_object_by_public_id(self, public_id):
        try:
            instance = self.get(public_id=public_id)
            return instance
        except (ObjectDoesNotExist, ValueError, TypeError):
            return Http404

class WBFAbstractModel(models.Model):
    public_id = models.UUIDField(
        db_index=True,
        unique=True,
        default=uuid4,
        editable=False
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_edited_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When this item was last edited by a user (not system updates)"
    )

    objects = WBFAbstractManager()

    _tracked_fields: list[str] = []  # Default field to track
    """Define which fields should be tracked for edits in each model.
    Override this in child models.
    """

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        """
        Override save to track meaningful content changes.
        Only updates last_edited_at when tracked fields change.
        """
        # Check if this is an update to an existing object
        if self.pk is not None:
            try:
                # Get the current state from database
                old_instance = self.__class__.objects.get(pk=self.pk)

                # Check if any tracked fields have changed
                fields_changed = False
                for field_name in self._tracked_fields:
                    if hasattr(self, field_name) and hasattr(old_instance, field_name):
                        old_value = getattr(old_instance, field_name)
                        new_value = getattr(self, field_name)

                        if old_value != new_value:
                            fields_changed = True
                            break

                # If tracked fields changed, mark as edited
                if fields_changed:
                    self.last_edited_at = timezone.now()

            except self.__class__.DoesNotExist:
                # Object doesn't exist in DB yet (shouldn't happen with pk check, but safety)
                pass
            except Exception:
                # Any other error, just continue with save
                pass

        # Call the parent save method
        super().save(*args, **kwargs)

    def mark_as_edited(self, save=True):
        """
        Manually mark the content as edited by a user.

        Args:
            save (bool): Whether to save the model after marking as edited
        """
        self.last_edited_at = timezone.now()
        if save:
            self.save(update_fields=['last_edited_at', 'updated_at'])

    @property
    def is_edited(self):
        """Check if content was edited after creation."""
        if not self.created_at or not self.updated_at:
            return False

        threshold = timedelta(seconds=1)
        return (self.updated_at - self.created_at) > threshold

    @property
    def time_since_creation(self):
        """Get timedelta since creation."""
        if not self.created_at:
            return None
        return timezone.now() - self.created_at

    @property
    def time_since_last_update(self):
        """Get timedelta since last update."""
        if not self.updated_at:
            return None
        return timezone.now() - self.updated_at
