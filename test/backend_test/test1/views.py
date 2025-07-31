from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from rest_framework import permissions, viewsets

from test1 import models, serializers

"""
# Create your views here.
def test1(request):
    templates = loader.get_template('first.html')
    return HttpResponse(templates.render())
"""
class Test1ViewSet(viewsets.ModelViewSet):
    queryset = models.Test1.objects.all()
    serializer_class = serializers.Test1Serializer
    permission_classes = [permissions.IsAuthenticated,]
