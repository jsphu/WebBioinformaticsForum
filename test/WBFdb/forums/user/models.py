from django.contrib.auth.models import (AbstractBaseUser, PermissionsMixin, Group, Permission)
from django.db import (models,)
from django.utils import (timezone,)
from django.contrib.auth.base_user import (BaseUserManager,)

class WBFUserManager(BaseUserManager):
    """Custom User Manager for WBF"""

    def create_user(self, email, password=None, **extra_fields):
        """Create normal user with no privileges"""
        if not email:
            raise ValueError('Email is required')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create super user with all privileges"""

        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_moderator', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class WBFUserModel(AbstractBaseUser, PermissionsMixin):
    """WBF Main User Model"""

    username = models.CharField(unique=True, max_length=256)
    email = models.EmailField(unique=True, max_length=255)

    # Personal information
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    # avatar = models.ImageField(upload_to="avatars", null=True)
    bio = models.TextField(max_length=1000, blank=True, help_text="Short biography")
    orcid = models.CharField(max_length=19, blank=True, help_text="ORCID ID (0000-0000-0000-0000)")
    university = models.CharField(max_length=200, blank=True)
    department = models.CharField(max_length=200, blank=True)

    # social accounts
    website = models.URLField(blank=True, help_text="Personal or lab website")
    twitter_profile = models.URLField(blank=True, help_text="Link to twitter/x account")
    github_profile = models.URLField(blank=True, help_text="Link to Github user account")
    linkedin_profile = models.URLField(blank=True, help_text="Link to linkedin profile")

    is_active = models.BooleanField(default=True)
    is_private = models.BooleanField(default=False)

    is_staff = models.BooleanField(default=False)
    is_moderator = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        Group,
        related_name='wbf_users',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='wbf_users',
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email',]

    objects = WBFUserManager()

    def __str__(self):
        return self.username

    def follow(self, user):
        """Follow a user"""
        from forums.user.follow import UserFollow
        if user != self and not self.is_following(user):
            UserFollow.objects.get_or_create(follower=self, following=user)

    def unfollow(self, user):
        """Unfollow a user"""
        from forums.user.follow import UserFollow
        UserFollow.objects.filter(follower=self, following=user).delete()

    def is_following(self, user):
        """Check if this user is following another user"""
        from forums.user.follow import UserFollow
        return UserFollow.objects.filter(follower=self, following=user).exists()

    def is_followed_by(self, user):
        """Check if this user is followed by another user"""
        from forums.user.follow import UserFollow
        return UserFollow.objects.filter(follower=user, following=self).exists()

    @property
    def followers_count(self):
        """Count of user's followers"""
        return self.user_followers.count()

    @property
    def following_count(self):
        """Count of user's following"""
        return self.user_following.count()

    @property
    def shares_count(self):
        """Count of user's shares"""
        return self.amplifies_created.filter(is_private=False).count()

    @property
    def comments_count(self):
        """Count of user's comments"""
        return self.opine_authored.all().count() # opine = comment

    @property
    def posts_count(self):
        """Count of user's posts"""
        return self.announce_authored.all().count() # announce = post

    @property
    def pipelines_count(self):
        """Count of user's pipelines"""
        return self.pipeline_owner.filter(is_private=False).count()

    @property
    def processes_count(self):
        """Count of user's pipelines"""
        return self.process_owner.filter(is_private=False).count()

    @property
    def parameters_count(self):
        """Count of user's pipelines"""
        return self.parameter_owner.filter(is_private=False).count()

    @property
    def likes_count(self):
        """Count of content user has liked"""
        return self.liked_by.count()

    @property
    def total_contribution_count(self):
        """Count of user's all contributions"""
        return (self.posts_count + self.shares_count
            + self.comments_count + self.processes_count
            + self.parameters_count + self.pipelines_count
        )
