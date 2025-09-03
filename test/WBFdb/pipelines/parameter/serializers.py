from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from pipelines.abstract.serializers import PIPESerializer
from pipelines.parameter.models import ParameterModel
from forums.user.models import WBFUserModel
from forums.user.serializers import WBFUserMiniSerializer

class ParameterSerializer(PIPESerializer):
    owner = serializers.SlugRelatedField(
        queryset=WBFUserModel.objects.all(),
        slug_field='id'
    )
    def validate_owner(self, value):
        if self.context["request"].user != value:
            raise ValidationError("You can't create a parameter for another user!")
        return value

    class Meta:
        model = ParameterModel
        """
        List of all the fields tat can be
        included in a request or a response.
        """
        fields = [
            'id', 'owner', 'key', 'value',
            'default_value', 'value_type',
            'is_edited', 'created_at', 'updated_at',
            'version_history', 'is_required'
        ]
        read_only_fields = ["is_edited"]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        owner = WBFUserModel.objects.get_object_by_public_id(
            rep["owner"]
        )
        rep["owner"] = WBFUserMiniSerializer(owner).data

        return rep
