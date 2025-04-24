from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test_api, name='test-api'),
    path('mentors/', views.mentor_list, name='mentor-list'),
    path('mentors/<int:pk>/', views.mentor_detail, name='mentor-detail'),
] 