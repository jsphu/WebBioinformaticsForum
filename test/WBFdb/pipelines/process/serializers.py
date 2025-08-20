from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from pipelines.abstract.serializers import PIPESerializer
from pipelines.process.models import ProcessModel
from pipelines.parameter.models import ParameterModel

from forums.user.models import WBFUserModel
from forums.user.serializers import WBFUserSerializer
from pipelines.parameter.serializers import ParameterSerializer

class ProcessSerializer(PIPESerializer):
    owner = serializers.SlugRelatedField(
        queryset=WBFUserModel.objects.all(),
        slug_field='id'
    )
    def validate_owner(self, value):
        if self.context["request"].user != value:
            raise ValidationError("You can't create a process for another user!")
        return value

    class Meta:
        model = ProcessModel
        """
        List of all the fields tat can be
        included in a request or a response.
        """
        fields = [
            'id', 'owner', 'process_name',
            'is_edited', 'created_at', 'updated_at',
            'description', 'version', 'parameter_processes'
        ]
        read_only_fields = ["is_edited"]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        owner = WBFUserModel.objects.get_object_by_public_id(
            rep["owner"]
        )
        parameters = instance.parameter_processes.all()

        rep["parameters"] = ParameterSerializer(parameters, many=True).data

        rep.pop('parameter_processes', None)

        rep["owner"] = WBFUserSerializer(owner).data

        return rep

    def update(self, instance, validated_data):
        if not instance.is_edited:
            validated_data['is_edited'] = True

        instance = super().update(instance, validated_data)

        return instance
