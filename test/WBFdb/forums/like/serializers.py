from rest_framework.serializers import UUIDField, StringRelatedField
from forums.abstract.serializers import AbstractSerializer
from ..like.models import LikeModel
from ..user.serializers import WBFUserSerializer

class LikeSerializer(AbstractSerializer):
    user = WBFUserSerializer(read_only=True)

    class Meta:
        model = LikeModel
        fields = ["user"]
