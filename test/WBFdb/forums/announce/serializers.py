from django.contrib.contenttypes.models import ContentType
from rest_framework.serializers import SerializerMethodField
from forums.abstract.serializers import AbstractSerializer
from .models import AnnounceModel
from ..like.models import LikeModel
from ..user.serializers import WBFUserSerializer
from ..opine.models import OpineModel

class AnnounceSerializer(AbstractSerializer):
    author = WBFUserSerializer(read_only=True)
    likes_count = SerializerMethodField()
    comments_count = SerializerMethodField()

    class Meta:
        model = AnnounceModel
        fields = [
            'id',
            'content',
            'author',
            'created_at',
            'updated_at',
            'is_edited',
            'last_edited_at',
            'likes_count',
            'comments_count'
        ]

    def get_likes_count(self, obj):
        likes = LikeModel.objects.get_likes_for_object(obj)
        return likes.count()

    def get_comments_count(self, obj):
        content_type = ContentType.objects.get_for_model(AnnounceModel)
        return OpineModel.objects.filter(
            content_type=content_type,
            object_id=obj.public_id
        ).count()
