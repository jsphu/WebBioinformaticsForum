from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count

from pipelines.abstract.views import PIPEViewSet
from pipelines.process.models import ProcessModel
from pipelines.process.serializers import ProcessSerializer

class ProcessViewSet(PIPEViewSet):
    queryset = ProcessModel.objects.prefetch_related('parameter_processes')
    http_method_names = (
        'post', 'get', 'put', 'delete'
    #     C       R      U       D
    )
    permission_classes = (IsAuthenticated,)
    serializer_class = ProcessSerializer
    filterset_fields = ['owner__id']

    def get_object(self):
        obj = ProcessModel.objects.get_object_by_public_id(
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
