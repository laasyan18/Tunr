# tunr_backend/urls.py
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from music.views import spotify_callback

def api_root(request):
    return JsonResponse({
        'message': 'Tunr API',
        'endpoints': {
            'admin': '/admin/',
            'auth': '/api/auth/',
            'movies': '/api/movies/',
            'spotify_login': '/spotify/login/',
            'spotify_api': '/api/spotify/',
        }
    })

urlpatterns = [
    path('', api_root, name='api_root'),  # Root endpoint
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/movies/', include('movies.urls')), 
    path('spotify/', include('music.urls')),  # Spotify routes
    path('callback/', spotify_callback, name='spotify_callback'),  # For the callback
    path('api/spotify/', include('music.urls')),
]
