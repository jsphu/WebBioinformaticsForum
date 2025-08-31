from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from pipelines.abstract.serializers import PIPESerializer
from pipelines.pipeline.models import PipelineModel
from pipelines.process.serializers import ProcessSerializer

from forums.user.models import WBFUserModel
from forums.user.serializers import WBFUserSerializer

class PipelineSerializer(PIPESerializer):
    owner = serializers.SlugRelatedField(
        queryset=WBFUserModel.objects.all(),
        slug_field='id'
    )
    def validate_owner(self, value):
        if self.context["request"].user != value:
            raise ValidationError("You can't create a pipeline for another user!")
        return value

    processes_count = serializers.SerializerMethodField()
    def get_processes_count(self, obj):
        processes = obj.processes
        return processes.count()

    total_parameters_count = serializers.SerializerMethodField()
    def get_total_parameters_count(self, obj):
        count=0
        for process in obj.processes.all():
            for param in process.parameters.all():
                count+=1
        return count
        #return sum([1 for process in obj.processes.all() for param in process.parameters.all()])

    flow_data = serializers.JSONField()
    def validate_flow_data(self, value):
        if isinstance(value, dict):
            if "nodes" not in value:
                raise ValidationError("You need 'nodes' data for flow!")
            if "edges" not in value:
                raise ValidationError("You need 'edges' data for flow!")
        else:
            raise ValidationError("flow_data must be a JSON")
        return value

    class Meta:
        model = PipelineModel
        """
        List of all the fields tat can be
        included in a request or a response.
        """
        fields = [
            'id', 'owner', 'pipeline_title',
            'is_edited', 'created_at', 'updated_at',
            'description', 'version', 'flow_data', 'processes',
            'processes_count', 'total_parameters_count',
            'version_history'
        ]
        read_only_fields = ["is_edited"]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        owner = WBFUserModel.objects.get_object_by_public_id(
            rep["owner"]
        )

        rep["owner"] = WBFUserSerializer(owner).data

        return rep
