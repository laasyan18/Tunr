# movies/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests
from django.conf import settings

@api_view(['GET'])
def search_movies(request):
    query = request.GET.get('query', '')
    
    if not query or len(query) < 2:
        return Response({'movies': []})
    
    try:
        # Read API key from settings (which reads from environment)
        api_key = settings.OMDB_API_KEY
        
        if not api_key:
            return Response({'movies': [], 'error': 'OMDB API key not configured'}, status=500)
        
        # OMDb API search endpoint
        url = f'http://www.omdbapi.com/?s={query}&type=movie&apikey={api_key}'
        
        response = requests.get(url)
        data = response.json()
        
        movies = []
        if data.get('Response') == 'True':
            movies = data.get('Search', [])
        
        return Response({'movies': movies})
        
    except Exception as e:
        print(f"Movie search error: {e}")
        return Response({'movies': [], 'error': str(e)}, status=500)


@api_view(['GET'])
def get_movie_details(request, imdb_id):
    """Get detailed information about a specific movie by IMDB ID"""
    try:
        api_key = settings.OMDB_API_KEY
        
        if not api_key:
            return Response({'error': 'OMDB API key not configured'}, status=500)
        
        # OMDb API detail endpoint
        url = f'http://www.omdbapi.com/?i={imdb_id}&apikey={api_key}'
        
        response = requests.get(url)
        data = response.json()
        
        if data.get('Response') == 'True':
            return Response(data)
        else:
            return Response({'error': data.get('Error', 'Movie not found')}, status=404)
        
    except Exception as e:
        print(f"Movie detail error: {e}")
        return Response({'error': str(e)}, status=500)
