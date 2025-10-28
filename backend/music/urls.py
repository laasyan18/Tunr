# backend/music/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.spotify_login, name='spotify_login'),
    path('search/', views.spotify_search, name='spotify_search'),
    path('user/', views.get_user_profile, name='spotify_user'),
    path('playlists/', views.get_user_playlists, name='spotify_playlists'),
    path('top-tracks/', views.get_top_tracks, name='spotify_top_tracks'),
    path('recently-played/', views.get_recently_played, name='spotify_recently_played'),
    path('following/', views.get_following, name='spotify_following'),
]
