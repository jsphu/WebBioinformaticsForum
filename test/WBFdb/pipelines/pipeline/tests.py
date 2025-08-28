from django.test import TestCase

# Create your tests here.
from .serializers import PipelineSerializer
from forums.user.models import WBFUserModel

def test_pipeline_serializer():

    owner = WBFUserModel.objects.first()

    pipeline_title = "asdasd"
    version = "1.0.0"
