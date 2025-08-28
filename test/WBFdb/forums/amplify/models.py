from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from forums.abstract.models import WBFAbstractModel, WBFAbstractManager

class AmplifyManager(WBFAbstractManager):
    """Amplify Manager"""

    def create_amplify(self, user, obj, content=""):
        """
        Create an amplify record with automatic content preservation for posts
        """
        content_type = ContentType.objects.get_for_model(obj)

        # Create the amplify record
        amplify = self.create(
            amplified_by=user,
            content_type=content_type,
            object_id=obj.pk,
            content=content
        )

        # Store original post content if it's a post
        amplify._store_original_content_if_post(obj)
        amplify.save()

        return amplify

    def get_amplifies_for_object(self, obj):
        """Get all amplifes for a specific object"""
        content_type = ContentType.objects.get_for_model(obj)
        return self.filter(content_type=content_type, object_id=obj.pk)

class AmplifyModel(WBFAbstractModel):
    """Amplify Model, synonyms; share, repost, forward..."""

    # Who shared it
    amplified_by = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="amplifies_created"
    )

    # What was shared (generic foreign key for UUID models)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    amplified_object = GenericForeignKey('content_type', 'object_id')

    # Optional add a comment
    content = models.TextField(max_length=8000, blank=True)

    # Store original content for posts (to preserve content if original is deleted/edited)
    original_post_content = models.TextField(blank=True, null=True)
    original_post_title = models.CharField(max_length=255, blank=True, null=True)
    original_post_author = models.CharField(max_length=150, blank=True, null=True)  # Store username as string
    original_post_created_at = models.DateTimeField(blank=True, null=True)

    # Flag to indicate if original content was preserved
    is_content_preserved = models.BooleanField(default=False)

    _tracked_fields = ['content', 'original_post_content', 'original_post_title']

    objects = AmplifyManager()

    def save(self, *args, **kwargs):
        # Auto-preserve content on creation if it's a post
        if not self.pk and not self.is_content_preserved:
            if self.amplified_object:
                self._store_original_content_if_post(self.amplified_object)
        super().save(*args, **kwargs)

    def _store_original_content_if_post(self, obj):
        """Store original post content if the amplified object is a post"""
        if self._is_post_model(obj):
            self.original_post_content = getattr(obj, 'content', '')
            self.original_post_title = getattr(obj, 'title', '')
            self.original_post_author = getattr(obj.author, 'username', '')
            self.original_post_created_at = getattr(obj, 'created_at', None)
            self.is_content_preserved = True

    def _is_post_model(self, obj):
        """Check if the object is a Post model"""
        return self.content_type.model == 'announcemodel'

    @property
    def display_content(self):
        """Get the content to display - preserved content for posts, or current object for others"""
        if self.is_content_preserved and self.original_post_content:
            return {
                'title': self.original_post_title,
                'content': self.original_post_content,
                'author': self.original_post_author,
                'created_at': self.original_post_created_at,
                'is_preserved': True,
                'original_exists': self.amplified_object is not None
            }
        elif self.amplified_object:
            return {
                'title': getattr(self.amplified_object, 'title', ''),
                'content': getattr(self.amplified_object, 'content', str(self.amplified_object)),
                'owner': getattr(getattr(self.amplified_object, 'owner', None), 'username', '') if hasattr(self.amplified_object, 'owner') else '',
                'created_at': getattr(self.amplified_object, 'created_at', None) or getattr(self.amplified_object, 'created', None),
                'is_preserved': False,
                'original_exists': True
            }
        else:
            return {
                'title': self.original_post_title or '',
                'content': self.original_post_content or 'Content no longer available',
                'author': self.original_post_author or 'Unknown',
                'created_at': self.original_post_created_at,
                'is_preserved': True,
                'original_exists': False
            }

    @property
    def is_original_deleted(self):
        """Check if the original object has been deleted"""
        return self.amplified_object is None

    @property
    def amplified_type(self):
        """Get the type of content being amplified"""
        return self.content_type.model

    def __str__(self):
        if self.is_content_preserved and self.original_post_title:
            obj_str = f'post: "{self.original_post_title}"'
        else:
            obj_str = str(self.amplified_object) if self.amplified_object else "deleted content"
        return f"{self.amplified_by.username} amplified {obj_str}"

    class Meta:
        db_table = "forums_amplify"
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['amplified_by']),
            models.Index(fields=['is_content_preserved']),
        ]
