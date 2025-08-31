from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from ..abstract.views import AbstractViewSet
from ..like.serializers import LikeSerializer
from ..like.models import LikeModel
from ..amplify.serializers import AmplifySerializer
from ..amplify.models import AmplifyModel
from .serializers import AnnounceSerializer
from .models import AnnounceModel

# Create your views here.
class AnnounceViewSet(AbstractViewSet):
    queryset = AnnounceModel.objects.all()

    ordering_fields = ['updated_at', 'created_at', 'last_edited_at']
    ordering = ['-updated_at']

    serializer_class = AnnounceSerializer
    lookup_value_regex = "[0-9a-fA-F-]{32,36}"

    def get_permissions(self):
        if self.action == "create":
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def get_object(self):
        obj = AnnounceModel.objects.get_object_by_public_id(self.kwargs['pk'])

        self.check_object_permissions(self.request, obj)

        return obj

    def perform_create(self, serializer):
        serializer.save(
            author=self.request.user,
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)

        return Response(serializer.data,status=status.HTTP_201_CREATED)

    @action(methods=['get'], detail=True, permission_classes=[AllowAny])
    def shares(self, request, pk=None):
        """All shares/reposts of post"""
        obj = self.get_object()
        shares = AmplifyModel.objects.get_amplifies_for_object(obj)
        serializer = AmplifySerializer(shares, many=True)

        if shares.count() > 0:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                status=status.HTTP_204_NO_CONTENT
            )

    @action(methods=['post'], detail=True, permission_classes=[IsAuthenticated])
    def share(self, request, pk=None):
        """Repost/Share the post"""
        try:
            announce = self.get_object()
            user = request.user

            # Create the share with optional comment from request
            comment = request.data.get('content', '')
            share = AmplifyModel.objects.create_amplify(user, announce, comment)
            serializer = AmplifySerializer(share)

            return Response(
                data=serializer.data,
                status=status.HTTP_201_CREATED
            )

        except ValidationError as e:
            return Response(
                {'error': 'Validation error', 'details': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            # Convert exception to string for JSON serialization
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(methods=['get'], detail=True, permission_classes=[AllowAny])
    def likes(self, request, pk=None):
        """All users that liked the post"""
        obj = self.get_object()
        likes = LikeModel.objects.get_likes_for_object(obj)
        serializer = LikeSerializer(likes, many=True)

        if likes.count() > 0:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                status=status.HTTP_204_NO_CONTENT
            )

    @action(methods=['post'], detail=True, permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        """Toggle like - single endpoint for like/unlike"""
        try:
            announce = self.get_object()
            user = request.user

            liked = LikeModel.objects.toggle_like(user, announce)

            if liked:
                return Response(
                    {'message': 'liked'},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {'message': 'unliked'},
                    status=status.HTTP_200_OK
                )

        except Exception as e:
            return Response(
                {'error': 'Failed to like'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
