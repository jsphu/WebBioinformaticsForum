from rest_framework.serializers import IntegerField, SerializerMethodField
from forums.abstract.serializers import AbstractSerializer
from .models import OpineModel
from ..like.models import LikeModel
from ..user.models import WBFUserModel
from ..user.serializers import WBFUserMiniSerializer

class OpineSerializer(AbstractSerializer):
    author = WBFUserMiniSerializer(read_only=True)
    likes_count = SerializerMethodField()

    class Meta:
        model = OpineModel
        fields = [
            'id',
            'content',
            'author',
            'is_edited',
            'created_at',
            'last_edited_at',
            'likes_count',
        ]

    def get_likes_count(self, obj):
        likes = LikeModel.objects.get_likes_for_object(obj)
        return likes.count()
