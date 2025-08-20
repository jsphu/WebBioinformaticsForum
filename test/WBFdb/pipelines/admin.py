from django.contrib import admin

from pipelines.parameter.models import ParameterModel
from pipelines.process.models import ProcessModel
from pipelines.pipeline.models import PipelineModel

@admin.register(ParameterModel)
class ParameterAdmin(admin.ModelAdmin):
    list_display = (
        'public_id', 'owner', 'key', 'value'
    )
    list_filter = (
        'owner',
    )
    search_fields = ('owner', 'key', 'value')
    fieldsets = (
        (
            None,
            {'fields': (
                    'owner', 'key', 'value',
                    'default_value', 'value_type',
                    'description'
                )
            }
        ),
    )

@admin.register(ProcessModel)
class ProcessAdmin(admin.ModelAdmin):
    list_display = (
        'public_id', 'owner', 'process_name', 'version'
    )
    list_filter = (
        'owner', 'process_name'
    )
    search_fields = ('owner', 'process_name', 'version', 'description')
    fieldsets = (
        (
            None,
            {'fields': (
                    'owner', 'process_name', 'version',
                    'description',
                )
            }
        ),
    )

@admin.register(PipelineModel)
class PipelineAdmin(admin.ModelAdmin):
    list_display = (
        'public_id', 'owner', 'pipeline_title', 'version'
    )
    list_filter = (
        'owner', 'pipeline_title', 'version'
    )
    search_fields = ('owner', 'pipeline_title', 'version')
    fieldsets = (
        (
            None,
            {'fields': (
                    'owner', 'pipeline_title', 'version',
                    'flow_data',
                    'description'
                )
            }
        ),
    )
