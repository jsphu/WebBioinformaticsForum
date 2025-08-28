import re
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404
from django.apps import apps
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from ..like.serializers import LikeSerializer
from ..like.models import LikeModel
from .serializers import AmplifySerializer
from .models import AmplifyModel

# Create your views here.
class AmplifyViewSet(ModelViewSet):

    serializer_class = AmplifySerializer
    permission_classes = [IsAuthenticated,]
    lookup_value_regex = "[0-9a-fA-F-]{32,36}"
    UUID_PATTERN = re.compile(r'^[0-9a-fA-F]{32}$|^[0-9a-fA-F-]{36}$')

    __PARENT_MODELS = {
        "share_pk": "forums_amplify.AmplifyModel", # SHARE/REPOST MODEL
        "post_pk": "forums_announce.AnnounceModel", # POST MODEL
        "parameter_pk": "pipelines_parameter.ParameterModel", # PARAMETER MODEL
        "process_pk": "pipelines_process.ProcessesModel", # PROCESS MODEL
        "pipeline_pk": "pipelines_pipeline.PipelineModel", # PIPELINE MODEL
    }

    def _get_parent_context(self):
        """
        Generic parent detection from URL kwargs
        Returns: (parent_model, parent_pk, parent_type) or (None, None, None)
        """
        parent_pks = {}

        # Find all potential parent PKs in kwargs
        for key, value in self.kwargs.items():
            if key.endswith('_pk') and self.UUID_PATTERN.match(str(value)):
                parent_type = key[:-3]  # Remove '_pk' suffix (e.g., 'post_pk' -> 'post')
                parent_pks[parent_type] = value

        # If no parent PKs found, this is direct access (e.g., /api/shares/)
        if not parent_pks:
            return None, None, None

        # If multiple parent PKs, prioritize based on common nesting patterns
        # Usually the "deeper" parent is more specific
        priority_order = [key[:-3] for key in self.__PARENT_MODELS.keys()]

        for parent_type in priority_order:
            if parent_type in parent_pks:
                if parent_type in self.__PARENT_MODELS:
                    parent_label = self.__PARENT_MODELS[parent_type].split(".")
                    app_label = parent_label[0]
                    model_name = parent_label[1]
                    parent_model = apps.get_model(app_label=app_label, model_name=model_name)
                    return parent_model, parent_pks[parent_type], parent_type

        # If we found PKs but no matching model, log and return None
        print(f"Found parent PKs {parent_pks} but no matching models in {list(self.__PARENT_MODELS.keys())}")
        return None, None, None

    def get_queryset(self):
        parent_model, parent_pk, parent_type = self._get_parent_context()

        if not parent_model:
            return AmplifyModel.objects.all()

        parent_instance = get_object_or_404(parent_model, public_id=parent_pk)

        content_type = ContentType.objects.get_for_model(parent_model)

        return AmplifyModel.objects.filter(
            content_type=content_type,
            object_id=parent_instance.public_id
        )

    def get_object(self):
        obj = AmplifyModel.objects.get_object_by_public_id(self.kwargs['pk'])

        self.check_object_permissions(self.request, obj)

        return obj

    def perform_create(self, serializer):
        parent_model, parent_pk, parent_type = self._get_parent_context()

        if not parent_model:
            raise ValueError("No valid parent lookup in kwargs")

        parent_instance = get_object_or_404(parent_model, public_id=parent_pk)

        content_type = ContentType.objects.get_for_model(parent_model)

        serializer.save(
            author=self.request.user,
            content_type=content_type,
            object_id=parent_instance.public_id
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)

        return Response(serializer.data,status=status.HTTP_201_CREATED)

    @action(methods=['get'], detail=True)
    def likes(self, request, pk=None, **kwargs):
        """All users that liked the post"""
        obj = self.get_object()
        likes = LikeModel.objects.get_likes_for_object(obj)
        serializer = LikeSerializer(likes, many=True)

        if likes.count() > 0:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {'message': 'no likes here'},
                status=status.HTTP_204_NO_CONTENT
            )

    @action(methods=['post'], detail=True)
    def like(self, request, pk=None, **kwargs):
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
