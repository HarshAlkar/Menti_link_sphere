from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.

@api_view(['GET'])
def api_overview(request):
    api_urls = {
        'API Overview': '/api/',
        'Admin Panel': '/admin/',
    }
    return Response(api_urls)
