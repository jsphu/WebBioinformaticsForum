from django.db import models
from django.core.exceptions import ValidationError

from pipelines.abstract.models import PIPEAbstractModel

class ProcessModel(PIPEAbstractModel):
    """Process model, customizable pipeline-steps"""

    _owner_related_name = "process_owner"
    _origin_related_name = "origin_process"
    _tracked_fields = [
        'process_name', 'description', 'version', 'inputs', 'outputs'
    ] # Field to track versions

    parameters = models.ManyToManyField(
        "pipelines_parameter.ParameterModel",
        related_name="processes"
    )

    process_name = models.CharField(max_length=64)

    description = models.TextField(max_length=1000, blank=True)

    version = models.CharField(max_length=64, default="0.0.1")

    inputs = models.JSONField(default=list, blank=True)

    outputs = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"{self.process_name}"

    class Meta:
        db_table = "pipelines_process"
        ordering = ['-created_at']
        verbose_name_plural = "Processes"

    def clean(self):
        if self.version:
            if '.' not in self.version:
                raise ValidationError("version must contain dots to track major/minor changes (e.g., '1.3.9')")

            version_nums = self.version.split('.')

            if len(version_nums) != 3:
                raise ValidationError("version must follow x.y.z format")

            for v in version_nums:
                if not v.isdigit() or int(v) < 0:
                    raise ValidationError("version parts must be non-negative integers")
