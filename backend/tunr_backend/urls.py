# tunr_backend/urls.py
from django.contrib import admin
from django.urls import path, include
from music.views import spotify_callback

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/movies/', include('movies.urls')),  # Add this line
    path('spotify/', include('music.urls')),  # Spotify routes
    path('callback/', spotify_callback, name='spotify_callback'),  # For the callback
    path('api/spotify/', include('music.urls')),
]
