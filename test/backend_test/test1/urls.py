from django.urls import path
from test1 import views

urlpatterns = [
    path('', views.Test1ViewSet, name="test1"),
]
