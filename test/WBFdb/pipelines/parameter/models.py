from django.db import models

from pipelines.abstract.models import PIPEAbstractModel

class ParameterModel(PIPEAbstractModel):
    """Parameter model, sharable parameter of any process"""

    _owner_related_name = "parameter_owner"
    _origin_related_name = "origin_parameter"
    _tracked_fields = [
        'description', 'key', 'value',
        'value_type', 'default_value', 'is_required'
    ] # Field to track versions

    processes = models.ManyToManyField(
        "pipelines_process.ProcessModel",
        related_name="parameter_processes"
    )

    description = models.TextField(max_length=512)

    key = models.CharField(max_length=64)
    value = models.TextField()
    value_type = models.CharField(max_length=64)
    default_value = models.TextField(blank=True)

    is_required = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.key} by {self.owner.username}"

    class Meta:
        db_table = "pipelines_parameter"
        ordering = ['-created_at']
        verbose_name_plural = "Parameters"
