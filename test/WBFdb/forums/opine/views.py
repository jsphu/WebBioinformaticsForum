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
from .serializers import OpineSerializer
from .models import OpineModel
from ..announce.models import AnnounceModel

# Create your views here.
class OpineViewSet(ModelViewSet):

    serializer_class = OpineSerializer
    permission_classes = [IsAuthenticated,]


    __PARENT_MODELS = {
        "post_pk": "forums_announce.AnnounceModel", # POST MODEL
        "share_pk": "forums_amplify.AmplifyModel", # SHARE/REPOST MODEL
        "parameter_pk": "pipelines_parameter.ParameterModel", # PARAMETER MODEL
        "process_pk": "pipelines_process.ProcessesModel", # PROCESS MODEL
        "pipeline_pk": "pipelines_pipeline.PipelineModel", # PIPELINE MODEL
    }

    def get_queryset(self):
        parent_lookup = next((k for k in self.kwargs if k in self.__PARENT_MODELS), None)
        if not parent_lookup:
            raise ValueError("No valid parent lookup in kwargs")

        parent_label = self.__PARENT_MODELS[parent_lookup].split(".")
        app_label = parent_label[0]  # eg. "forums_announce"
        model_name = parent_label[1] # eg. "AnnounceModel"

        parent_model = apps.get_model(app_label=app_label, model_name=model_name)
        parent_pk = self.kwargs[parent_lookup]

        parent_instance = get_object_or_404(parent_model, public_id=parent_pk)

        content_type = ContentType.objects.get_for_model(parent_model)

        return OpineModel.objects.filter(
            content_type=content_type,
            object_id=parent_instance.public_id
        )

    def get_object(self):
        obj = OpineModel.objects.get_object_by_public_id(self.kwargs['pk'])

        self.check_object_permissions(self.request, obj)

        return obj


    def perform_create(self, serializer):

        parent_lookup = next((k for k in self.kwargs if k in self.__PARENT_MODELS), None)
        if not parent_lookup:
            raise ValueError("No valid parent lookup in kwargs")

        parent_pk = self.kwargs[parent_lookup]

        parent_label = self.__PARENT_MODELS[parent_lookup].split(".")
        app_label = parent_label[0]  # eg. "forums_announce"
        model_name = parent_label[1] # eg. "AnnounceModel"

        model = apps.get_model(app_label=app_label, model_name=model_name)

        parent_obj = get_object_or_404(model, public_id=parent_pk)
        content_type = ContentType.objects.get_for_model(model)

        serializer.save(
            author=self.request.user,
            content_type=content_type,
            object_id=parent_obj.public_id
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
