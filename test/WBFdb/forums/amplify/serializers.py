from django.contrib.contenttypes.models import ContentType
from rest_framework.serializers import SerializerMethodField
from forums.abstract.serializers import AbstractSerializer
from .models import AmplifyModel
from ..like.models import LikeModel
from ..user.serializers import WBFUserMiniSerializer, WBFUserSerializer
from ..opine.models import OpineModel

class AmplifySerializer(AbstractSerializer):
    amplified_by = WBFUserSerializer(read_only=True)
    amplified_object = SerializerMethodField()
    amplified_object_owner = SerializerMethodField()
    original_content = SerializerMethodField()
    is_original_deleted = SerializerMethodField()
    likes_count = SerializerMethodField()
    comments_count = SerializerMethodField()

    class Meta:
        model = AmplifyModel
        fields = [
            'id',
            'content',  # Amplifier's comment
            'amplified_by',  # User who amplified
            'amplified_object',  # The amplified object data
            'amplified_object_owner',  # Owner of the amplified content
            'original_content',  # Preserved content for posts
            'is_original_deleted',  # Whether original still exists
            'created_at',
            'is_edited',
            'last_edited_at',
            'likes_count',
            'comments_count'
        ]

    def get_amplified_object(self, obj):
        """Get the amplified object data"""
        if obj.amplified_object:
            # For live objects, return current data
            amplified_obj = obj.amplified_object

            # Get basic object info
            object_data = {
                'id': getattr(amplified_obj, 'public_id', None) or getattr(amplified_obj, 'id', None),
                'type': obj.content_type.model,
                'exists': True
            }

            # Add type-specific fields
            if hasattr(amplified_obj, 'title'):
                object_data['title'] = amplified_obj.title
            if hasattr(amplified_obj, 'content'):
                object_data['content'] = amplified_obj.content
            if hasattr(amplified_obj, 'created_at'):
                object_data['created_at'] = amplified_obj.created_at
            elif hasattr(amplified_obj, 'created'):
                object_data['created_at'] = amplified_obj.created

            return object_data
        else:
            # Object was deleted, return basic info
            return {
                'id': obj.object_id,
                'type': obj.content_type.model,
                'exists': False,
                'title': None,
                'content': None,
                'created_at': None
            }

    def get_amplified_object_owner(self, obj):
        """Get the author of the amplified content"""
        if obj.amplified_object and hasattr(obj.amplified_object, 'author'):
            # Live object - serialize the actual author
            return WBFUserMiniSerializer(obj.amplified_object.author, read_only=True).data
        elif obj.amplified_object and hasattr(obj.amplified_object, 'owner'):
            # Live object - serialize the actual author
            return WBFUserMiniSerializer(obj.amplified_object.owner, read_only=True).data
        elif obj.is_content_preserved and obj.original_post_author:
            # Preserved content - return stored author info
            return {
                'username': obj.original_post_author,
                'is_preserved': True  # Flag to indicate this is preserved data
            }
        else:
            # No author info available
            return None

    def get_original_content(self, obj):
        """Get preserved original content (for posts) or indicate live content"""
        if obj.is_content_preserved:
            return {
                'title': obj.original_post_title,
                'content': obj.original_post_content,
                'author': obj.original_post_author,
                'created_at': obj.original_post_created_at,
                'is_preserved': True,
                'preserved_at': obj.created_at  # When it was preserved
            }
        else:
            return {
                'is_preserved': False,
                'note': 'Content is live and may change'
            }

    def get_is_original_deleted(self, obj):
        """Check if the original amplified object was deleted"""
        return obj.is_original_deleted

    def get_likes_count(self, obj):
        likes = LikeModel.objects.get_likes_for_object(obj)
        return likes.count()

    def get_comments_count(self, obj):
        content_type = ContentType.objects.get_for_model(AmplifyModel)
        return OpineModel.objects.filter(
            content_type=content_type,
            object_id=obj.public_id
        ).count()

    def to_representation(self, instance):
        """Customize the representation to provide a clean API response"""
        rep = super().to_representation(instance)

        # Add a unified display_content field for frontend convenience
        display_content = instance.display_content
        rep['display_content'] = {
            'title': display_content['title'],
            'content': display_content['content'],
            'owner_username': display_content['owner'],
            'created_at': display_content['created_at'],
            'is_preserved': display_content['is_preserved'],
            'original_exists': display_content['original_exists']
        }

        return rep
