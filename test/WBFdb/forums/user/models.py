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
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=128, null=True, blank=True)
    last_name = models.CharField(max_length=128, null=True, blank=True)
    # avatar = models.ImageField(upload_to="avatars", null=True)
    bio = models.TextField(blank=True, null=True)
    orcid = models.CharField(null=True, blank=True)
    university = models.CharField(null=True, blank=True)
    department = models.CharField(null=True, blank=True)
    joined_at = models.DateTimeField(default=timezone.now)

    is_active = models.BooleanField(default=True)

    is_staff = models.BooleanField(default=False)
    is_moderator = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        Group,
        related_name='wbfuser_groups',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='wbfuser_permissions',
        blank=True
    )

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email',]

    objects = WBFUserManager()

    def __str__(self):
        return self.username
