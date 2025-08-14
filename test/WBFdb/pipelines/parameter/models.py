from django.db import models
from django.conf import settings
from uuid import uuid4

class ParameterModel(models.Model):
    """Parameter model, sharable parameter of any process"""

    public_id = models.UUIDField(
        db_index=True,
        default=uuid4,
        editable=False,
        unique=True,
    )

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="parameter_authored",
    )

    processes = models.ManyToManyField(
        "pipelines_process.ProcessModel",
        related_name="parameter_processes"
    )


    originated_from = models.ForeignKey(
        'self',  # Points to another Parameter
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="origin_parameter"
    )

    description = models.TextField(max_length=512)

    key = models.CharField(max_length=64)
    value = models.TextField()
    value_type = models.CharField(max_length=64)
    default_value = models.TextField(blank=True)

    is_required = models.BooleanField(default=True)
    is_private = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
