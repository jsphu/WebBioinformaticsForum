from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView,)
from django.urls import path

urlpatterns = [
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
