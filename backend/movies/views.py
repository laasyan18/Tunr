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
        # Replace 'YOUR_API_KEY_HERE' with your actual OMDb API key
        api_key = 'eada15a9'  # Put your OMDb API key here
        
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
