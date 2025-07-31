from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets

from restapi.serializers import GroupSerializer, UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    """API ENDPOINT FOR USER MANAGEMENT"""
    queryset = User.objects.all().order_by('-date_joined')
    # SELECT * WHERE User SORT date_joined DESC;
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class GroupViewSet(viewsets.ModelViewSet):
    """API ENDPOINT FOR GROUP MANAGEMENT"""
    queryset = Group.objects.all().order_by('name')
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]
