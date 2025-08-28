from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count

from pipelines.abstract.views import PIPEViewSet
from pipelines.pipeline.models import PipelineModel
from pipelines.pipeline.serializers import PipelineSerializer
from pipelines.process.serializers import ProcessSerializer

class PipelineViewSet(PIPEViewSet):
    queryset = PipelineModel.objects.all()
    http_method_names = (
        'post', 'get', 'put', 'delete'
    #     C       R      U       D
    )
    permission_classes = (IsAuthenticated,)
    serializer_class = PipelineSerializer
    filterset_fields = ['owner__id']

    def get_object(self):
        obj = PipelineModel.objects.get_object_by_public_id(
            self.kwargs['pk']
        )

        self.check_object_permissions(
            self.request,
            obj
        )

        return obj

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )
        serializer.is_valid(
            raise_exception=True
        )
        self.perform_create(
            serializer
        )
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    @action(methods=['get'], detail=True)
    def processes(self ,request, pk=None):
        """All processes belongs to the pipeline"""
        pipeline = self.get_object()
        processes = pipeline.processes
        if processes.count() > 0:
            serializer = ProcessSerializer(processes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {'message': 'no processes here'},
                status=status.HTTP_204_NO_CONTENT
            )
