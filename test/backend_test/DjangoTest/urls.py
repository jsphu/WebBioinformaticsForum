"""
URL configuration for DjangoTest project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.global_settings import MEDIA_ROOT, MEDIA_URL
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework import routers

from restapi import views
from test1.views import Test1ViewSet, upload_file, FileViewSet, ImageViewSet
from graphs.views import graph_view, get_files_view

from forumcore.user.views import UserViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'groups', views.GroupViewSet)
router.register(r'test', Test1ViewSet)
router.register(r'file', FileViewSet, basename="filemodel")
router.register(r'image', ImageViewSet, basename="imagemodel")

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('graph/<str:file>/', graph_view, name="graph"),
    path('files/', get_files_view, name="file_list"),
    path('upload/', upload_file, name="upload_file")
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
