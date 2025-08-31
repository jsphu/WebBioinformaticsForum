from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework import status

from forums.user.models import WBFUserModel
from forums.user.serializers import WBFUserSerializer, UserFollowSerializer, TokenWithUserDataSerializer, UserRegisterSerializer
from forums.abstract.views import AbstractViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Create your views here.
class TokenWithUserDataView(TokenObtainPairView):
    serializer_class = TokenWithUserDataSerializer

class TokenWithUserRefreshView(TokenRefreshView):
    pass

class WBFUserRegisterView(CreateAPIView):
    queryset = WBFUserModel.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny,]

class WBFUserViewSet(AbstractViewSet):
    permission_classes = [IsAuthenticated,]
    serializer_class = WBFUserSerializer

    def get_queryset(self):
        user = self.request.user

        if user.is_private and not (user.is_superuser or user.is_staff):
            user_self = WBFUserModel.objects.filter(pk=user.pk)
            others = WBFUserModel.objects.filter(is_superuser=False, is_private=False)
            queryset = others | user_self
        elif user.is_superuser or user.is_staff:
            queryset = WBFUserModel.objects.all()
        else:
            queryset = WBFUserModel.objects.filter(is_superuser=False, is_private=False)

        return queryset

    def get_object(self):
        obj = WBFUserModel.objects.get_object_by_public_id(self.kwargs['pk'])

        self.check_object_permissions(self.request, obj)

        return obj

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)

        return Response(serializer.data,status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def followers(self, request, pk=None):
        """All users that following the user"""
        user = self.get_object()
        serializer = UserFollowSerializer(user.user_followers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def following(self, request, pk=None):
        """All users that followed by the user"""
        user = self.get_object()
        serializer = UserFollowSerializer(user.user_following, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def follow(self, request, pk=None):
        try:
            current_user = request.user

            user_to_follow = self.get_object()

            if current_user.id == user_to_follow.id:
                return Response(
                    {'error': 'You cannot follow yourself'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not current_user.is_following(user_to_follow):
                current_user.follow(user_to_follow)
                return Response(
                    {'message': f'You are now following {user_to_follow.username}'},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {'message': 'You are already following this user'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except WBFUserModel.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'])
    def unfollow(self, request, pk=None):
        try:
            current_user = request.user

            user_to_unfollow = self.get_object()

            if current_user.id == user_to_unfollow.id:
                return Response(
                    {'error': 'You cannot unfollow yourself'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if current_user.is_following(user_to_unfollow):
                current_user.unfollow(user_to_unfollow)
                return Response(
                    {'message': f'You have unfollowed {user_to_unfollow.username}'},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {'message': 'You are not following this user'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except WBFUserModel.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
