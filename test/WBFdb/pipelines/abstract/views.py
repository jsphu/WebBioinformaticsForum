from rest_framework import status
from rest_framework.filters import OrderingFilter
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError

from forums.like.models import LikeModel
from forums.like.serializers import LikeSerializer
from forums.amplify.models import AmplifyModel
from forums.amplify.serializers import AmplifySerializer

class PIPEViewSet(ModelViewSet):
    filter_backends = [OrderingFilter]
    ordering_fields = ['updated_at', 'created_at']
    ordering = ['-updated_at']

    @action(methods=['get'], detail=True)
    def shares(self, request, pk=None):
        """All shares/reposts"""
        obj = self.get_object()
        shares = AmplifyModel.objects.get_amplifies_for_object(obj)
        serializer = AmplifySerializer(shares, many=True)

        if shares.count() > 0:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                status=status.HTTP_204_NO_CONTENT
            )

    @action(methods=['post'], detail=True)
    def share(self, request, pk=None):
        """Repost/Share"""
        try:
            obj = self.get_object()
            user = request.user

            # Create the share with optional comment from request
            comment = request.data.get('content', '')
            share = AmplifyModel.objects.create_amplify(user, obj, comment)
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

    @action(methods=['get'], detail=True)
    def likes(self, request, pk=None, **kwargs):
        """All users that liked"""
        obj = self.get_object()
        likes = LikeModel.objects.get_likes_for_object(obj)
        serializer = LikeSerializer(likes, many=True)

        if likes.count() > 0:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                status=status.HTTP_204_NO_CONTENT
            )

    @action(methods=['post'], detail=True)
    def like(self, request, pk=None, **kwargs):
        """Single endpoint for like/unlike"""
        try:
            opine = self.get_object()
            user = request.user

            liked = LikeModel.objects.toggle_like(user, opine)

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
