import re
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

class VersionView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        url = "https://raw.githubusercontent.com/jsphu/WebBioinformaticsForum/refs/heads/main/README.md"
        response = requests.get(url).text

        match = re.search(r"## Version[:\s]*([\d\.]+)", response)
        version = match.group(1) if match else "unknown"

        return Response(version, status=status.HTTP_200_OK)
