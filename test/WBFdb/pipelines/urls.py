from django.urls import include, path

from pipelines.parameter.views import ParameterViewSet
from pipelines.process.views import ProcessViewSet
from pipelines.pipeline.views import PipelineViewSet
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register(r'pipelines', PipelineViewSet, basename="pipelines")
router.register(r'processes', ProcessViewSet, basename="processes")
router.register(r'parameters', ParameterViewSet, basename="parameters")

urlpatterns = [
    path('api/', include(router.urls))
]
