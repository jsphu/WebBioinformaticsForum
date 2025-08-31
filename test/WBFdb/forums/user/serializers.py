from rest_framework import serializers
from forums.abstract.serializers import AbstractSerializer
from forums.user.models import WBFUserModel, UserFollow
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, PasswordField

from django.conf import settings

class TokenWithUserDataSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        data["user"] = WBFUserSerializer(self.user).data

        return data

class UserRegisterSerializer(AbstractSerializer):
    password = PasswordField(min_length=8)

    class Meta:
        model = WBFUserModel
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        username, email, password = validated_data["username"], validated_data["email"], validated_data["password"]
        user = WBFUserModel.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        return user

class UserFollowSerializer(AbstractSerializer):
    id = serializers.UUIDField(read_only=True, source="public_id")
    user = serializers.SerializerMethodField()

    def get_user(self, obj):
        mode = self.context.get("mode")
        user = obj.follower if mode == "followers" else obj.following
        return {"id": str(user.id), "username": user.username}

    class Meta:
        model = UserFollow
        fields = ['id','user','created_at']


class WBFUserSerializer(AbstractSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:

        model = WBFUserModel

        fields = [
            'id', 'username', 'first_name', 'last_name', 'bio', 'orcid', 'university',
            'department', 'website', 'twitter_profile', 'github_profile', 'linkedin_profile',
            'followers_count', 'following_count', 'shares_count', 'posts_count', 'comments_count',
            'likes_count', 'pipelines_count', 'processes_count', 'parameters_count',
            'total_contribution_count', 'is_active', 'is_staff', 'is_moderator',
            'created_at', 'updated_at'
        ]
        read_only_field = ['is_active']

    """ UNIMPLEMENTED
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if not representation['avatar']:
            representation['avatar'] = settings.DEFAULT_AVATAR_URL
        else:
            if settings.DEBUG: # Debug for dev
                request = self.context.get(
                    'request'
                )
                if request:
                    representation['avatar'] = request.build_absolute_uri(
                        representation['avatar']
                    )
        return representation
    """

class WBFUserMiniSerializer(AbstractSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:

        model = WBFUserModel

        fields = [
            'id', 'username', 'followers_count', 'is_active'
        ]
        read_only_field = [ 'is_active' ]
