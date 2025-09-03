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

    parameters_count = serializers.SerializerMethodField()

    parameters = ParameterSerializer(many=True)

    def get_parameters_count(self, obj):
        parameters = obj.parameters
        return parameters.count()

    def validate_parameters(self, value):
        keys = [param.key for param in value]
        duplicates = {f"('{k}' counted {c} times)" for k in keys if (c:=keys.count(k)) > 1}
        if duplicates:
            raise serializers.ValidationError(
                f"Parameter keys should be unique! {', '.join(duplicates)}"
            )
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
            'description', 'version', 'parameters_count',
            'parameters', 'version_history',
            'originated_from', 'inputs', 'outputs'
        ]
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        owner = WBFUserModel.objects.get_object_by_public_id(
            rep["owner"]
        )
        rep["owner"] = WBFUserSerializer(owner).data

        return rep
