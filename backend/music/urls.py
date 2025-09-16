# backend/music/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.spotify_login, name='spotify_login'),
    path('search/', views.spotify_search, name='spotify_search'),
    path('user/', views.get_user_profile, name='spotify_user'),
]
