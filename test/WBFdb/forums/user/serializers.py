from forums.abstract.serializers import AbstractSerializer
from forums.user.models import WBFUserModel

from django.conf import settings

class WBFUserSerializer(AbstractSerializer):

    class Meta:

        model = WBFUserModel

        fields = [
            'id', 'username', 'first_name', 'last_name',
            'email', 'is_active', 'created_at', 'updated_at',
            'is_moderator', 'is_staff', 'bio'
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
