from django.db import models
from django.core.exceptions import ValidationError

from pipelines.abstract.models import PIPEAbstractModel

class PipelineModel(PIPEAbstractModel):
    """Pipeline/Workflow Model, multiple steps of defined processes"""

    _owner_related_name = "pipeline_owner"
    _origin_related_name = "origin_pipeline"
    _tracked_fields = [
        'pipeline_title', 'description',
        'version', 'flow_data'
    ] # Field to track versions

    processes = models.ManyToManyField(
        'pipelines_process.ProcessModel',
        related_name='pipelines',
    )

    pipeline_title = models.CharField(max_length=128)

    description = models.TextField(max_length=16000)

    # """UNIMPLEMENTED"""
    # media_attachments = models.FileField(blank=True, null=True, upload_to="uploads/pipelines")

    version = models.CharField(max_length=64, default="0.0.1")

    flow_data = models.JSONField(
        default=dict,
        help_text="ReactFlow nodes and edges data"
    )
    """ReactFlow Data JSONField
    {
        'nodes': [
            {
                'id': number,
                'type': string,
                'data': 'processId' #<<-Frontend will return process model data here.
                'position': null, #<<-Frontend will handle positions.
                **extra_fields,
            },
        ],
        'edges': [
            {
                'id': string,
                'type': string,
                'source': number,
                'target': number,
                **extra_fields,
            },
        ],
        **extra_fields # <<- any other fields can be included here.
    """

    def __str__(self):
        return f"{self.pipeline_title}"

    class Meta:
        db_table = "pipelines_pipeline"
        ordering = ['-created_at']
        verbose_name_plural = "Pipelines"

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

        if self.flow_data:
            # Check required keys exist
            for key in ['nodes', 'edges']:
                if key not in self.flow_data:
                    raise ValidationError(f"flow_data must contain '{key}' field")

            # Validate that nodes/edges are lists
            if not isinstance(self.flow_data['nodes'], list):
                raise ValidationError("flow_data['nodes'] must be a list")
            if not isinstance(self.flow_data['edges'], list):
                raise ValidationError("flow_data['edges'] must be a list")
