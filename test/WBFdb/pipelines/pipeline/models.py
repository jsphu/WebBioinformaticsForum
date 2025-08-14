from django.db import models
from django.conf import settings
from uuid import uuid4
from django.core.exceptions import ValidationError

class PipelineModel(models.Model):
    """Pipeline/Workflow Model, multiple steps of defined processes"""

    # Primary Key of Pipeline
    public_id = models.UUIDField(
        db_index=True,
        default=uuid4,
        editable=False,
        unique=True,
    )

    originated_from = models.ForeignKey(
        'self',  # Points to another Pipeline
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="origin_pipeline"
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="pipeline_owner"
    )

    pipeline_title = models.CharField(max_length=128)

    description = models.TextField(max_length=16000)

    # """UNIMPLEMENTED"""
    # media_attachments = models.FileField(blank=True, null=True, upload_to="uploads/pipelines")

    version = models.CharField(max_length=64, default="0.0.1a")

    is_private = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    processes = models.ManyToManyField(
        'pipelines_process.ProcessModel',
        related_name='pipelines',
    )

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

    def clean(self):
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

    def __str__(self):
        return f"{self.pipeline_title}"

    class Meta:
        db_table = "pipelines_pipeline"
        ordering = ['-created_at']
        verbose_name_plural = "Pipelines"
