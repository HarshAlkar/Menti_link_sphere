from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Mentor
from .serializers import MentorSerializer

# Create your views here.

@api_view(['GET'])
def test_api(request):
    return Response({
        'message': 'API is working!',
        'status': 'success'
    })

def index(request):
    return render(request, 'index.html', {
        'STATIC_URL': '/static/',
        'DEBUG': True,
    })

@api_view(['GET', 'POST'])
def mentor_list(request):
    if request.method == 'GET':
        mentors = Mentor.objects.all()
        serializer = MentorSerializer(mentors, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = MentorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def mentor_detail(request, pk):
    try:
        mentor = Mentor.objects.get(pk=pk)
    except Mentor.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = MentorSerializer(mentor)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = MentorSerializer(mentor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        mentor.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
