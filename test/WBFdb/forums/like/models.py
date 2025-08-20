from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from forums.abstract.models import WBFAbstractModel, WBFAbstractManager


class LikeManager(WBFAbstractManager):
    """Custom manager for Like operations"""

    def get_likes_for_object(self, obj):
        """Get all likes for a specific object"""
        content_type = ContentType.objects.get_for_model(obj)
        return self.filter(content_type=content_type, object_id=obj.pk)

    def user_liked_object(self, user, obj):
        """Check if user already liked this object"""
        content_type = ContentType.objects.get_for_model(obj)
        return self.filter(
            user=user,
            content_type=content_type,
            object_id=obj.pk
        ).exists()

    def toggle_like(self, user, obj):
        """Toggle like - add if doesn't exist, remove if exists"""
        content_type = ContentType.objects.get_for_model(obj)
        like, created = self.get_or_create( # returns (model, bool)
            user=user,
            content_type=content_type,
            object_id=obj.pk,
            defaults={'liked_content': obj}
        )

        if not created:
            like.delete()
            return False  # Like removed
        return True  # Like added


class LikeModel(WBFAbstractModel):
    """Like-Any Junction Model - Users can like any content"""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="liked_by",
    )

    # Generic foreign key to any model
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    liked_content = GenericForeignKey('content_type', 'object_id')

    objects = LikeManager()

    def __str__(self):
        content_str = str(self.liked_content) if self.liked_content else "deleted content"
        return f"{self.user.username} liked {content_str}"

    class Meta:
        db_table = "forums_like"
        unique_together = [['user', 'content_type', 'object_id']]
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['user']),
        ]
