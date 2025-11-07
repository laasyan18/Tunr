# backend/music/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.spotify_login, name='spotify_login'),
    path('disconnect/', views.disconnect_spotify, name='spotify_disconnect'),
    path('search/', views.spotify_search, name='spotify_search'),
    path('user/', views.get_user_profile, name='spotify_user'),
    path('playlists/', views.get_user_playlists, name='spotify_playlists'),
    path('top-tracks/', views.get_top_tracks, name='spotify_top_tracks'),
    path('recently-played/', views.get_recently_played, name='spotify_recently_played'),
    path('following/', views.get_following, name='spotify_following'),
    path('like-song/', views.like_song, name='like_song'),
    path('like-playlist/', views.like_playlist, name='like_playlist'),
    path('library/', views.get_music_library, name='music_library'),
    path('check-liked/', views.check_liked_status, name='check_liked_status'),
]
