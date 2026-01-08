"""
URL configuration for loldraft project.

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
from django.contrib import admin
from django.urls import path
from lold import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('create/', views.CreateRoom, name='create_room'),
    path('', views.main_page),
    path('room/<str:room_id>/', views.draft_room, name='draft_room'),
    path('room/<str:room_id>/join/', views.join_side, name='join_side'),
    path('room/<str:room_id>/draft/', views.handle_draft_action, name='perform_action'),
    path('room/<str:room_id>/status/', views.room_status, name='room_status'),
]
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)