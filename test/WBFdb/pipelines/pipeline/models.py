from django.db import models
from django.conf import settings
from uuid import uuid4

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
