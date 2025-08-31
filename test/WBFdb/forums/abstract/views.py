from rest_framework import viewsets
from rest_framework import filters
from rest_framework.permissions import AllowAny

class AbstractViewSet(viewsets.ModelViewSet):
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['updated_at', 'created_at']
    ordering = ['-updated_at']
    permission_classes = [AllowAny]
