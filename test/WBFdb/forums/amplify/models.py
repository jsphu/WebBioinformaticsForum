from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from forums.abstract.models import WBFAbstractModel, WBFAbstractManager

class AmplifyManager(WBFAbstractManager):
    """Amplify Manager"""
    pass

class AmplifyModel(WBFAbstractModel):
    """Amplify Model, synonyms; share, repost, forward..."""

    # Who shared it
    amplified_by = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="amplifies_created"
    )

    # What was shared (generic foreign key for UUID models)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    amplified_object = GenericForeignKey('content_type', 'object_id')

    # Optional add a comment
    content = models.TextField(max_length=8000, blank=True)

    _tracked_fields = ['content']

    objects = AmplifyManager()

    def __str__(self):
        obj_str = str(self.amplified_object) if self.amplified_object else "deleted content"
        return f"{self.amplified_by.username} amplified {obj_str}"

    class Meta:
        db_table = "forums_amplify"
        unique_together = ['amplified_by', 'content_type', 'object_id']
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['amplified_by']),
        ]
