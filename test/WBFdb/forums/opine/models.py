from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from forums.abstract.models import WBFAbstractModel, WBFAbstractManager

# Create your models here.
class OpineManager(WBFAbstractManager):
    """Opinion Manager"""
    pass

class OpineModel(WBFAbstractModel):
    """Opinion Model"""

    author = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="opine_authored",
        null=True,
    )

    content = models.TextField(max_length=8000)

    _tracked_fields = ['content']

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    opined_object = GenericForeignKey('content_type', 'object_id')

    objects = OpineManager()

    def __str__(self):
        return f"{self.author.username if self.author else 'Deleted User'}"

    class Meta:
        db_table = "forums_opine"
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['author']),
        ]
