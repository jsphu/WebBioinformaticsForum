from django.shortcuts import render, redirect
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


class FileViewSet(viewsets.ModelViewSet):
    queryset = models.FileModel.objects.all()
    serializer_class = serializers.FileSerializer
    permission_classes = [permissions.AllowAny]

class ImageViewSet(viewsets.ModelViewSet):
    queryset = models.ImageModel.objects.all()
    serializer_class = serializers.ImageSerializer
    permission_classes = [permissions.AllowAny]


def upload_file(request):
    if request.method == 'POST':
        form = serializers.FileForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect("/file/")
    else:
        form = serializers.FileForm()
    return render(request, 'upload.html', {'form': form})
