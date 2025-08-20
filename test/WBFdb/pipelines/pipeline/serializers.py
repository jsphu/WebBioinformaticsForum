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

    class Meta:
        model = PipelineModel
        """
        List of all the fields tat can be
        included in a request or a response.
        """
        fields = [
            'id', 'owner', 'pipeline_title',
            'is_edited', 'created_at', 'updated_at',
            'description', 'version', 'flow_data', 'processes'
        ]
        read_only_fields = ["is_edited"]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        owner = WBFUserModel.objects.get_object_by_public_id(
            rep["owner"]
        )
        processes = instance.processes.all()

        rep["processes"] = ProcessSerializer(processes, many=True).data

        rep["owner"] = WBFUserSerializer(owner).data

        return rep

    def update(self, instance, validated_data):
        if not instance.is_edited:
            validated_data['is_edited'] = True

        instance = super().update(instance, validated_data)

        return instance
