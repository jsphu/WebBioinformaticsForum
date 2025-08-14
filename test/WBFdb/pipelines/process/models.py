from django.db import models
from django.conf import settings
from uuid import uuid4

class ProcessModel(models.Model):
    """Process model, customizable pipeline-steps"""

    # Primary Key of Processes
    public_id = models.UUIDField(
        db_index=True,
        unique=True,
        default=uuid4,
        editable=False,
    )

    originated_from = models.ForeignKey(
        'self',  # Points to another Process
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="origin_process"
    )

    process_name = models.CharField(max_length=64)

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="process_owner"
    )

    description = models.TextField(max_length=1000, blank=True)

    version = models.CharField(max_length=64, default="0.0.1a")

    is_private = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.process_name}"

    class Meta:
        db_table = "pipelines_process"
        ordering = ['-created_at']
        verbose_name_plural = "Processes"
