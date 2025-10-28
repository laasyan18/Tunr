# tunr_backend/views.py
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from django.http import JsonResponse

@api_view(['GET'])
def search_movies(request):
    query = request.GET.get('query', '')
    
    if not query:
        return JsonResponse({'error': 'query parameter is required'}, status=400)
    
    omdb_api_key = settings.OMDB_API_KEY
    url = f'http://www.omdbapi.com/?apikey={omdb_api_key}&s={query}&type=movie'
    
    try:
        response = requests.get(url)
        data = response.json()
        
        if data.get('Response') == 'True':
            return JsonResponse({
                'movies': data.get('Search', []),
                'total_results': data.get('totalResults', 0)
            })
        else:
            return JsonResponse({
                'movies': [], 
                'error': data.get('Error', 'No movies found')
            })
            
    except Exception as e:
        return JsonResponse({'error': 'API request failed'}, status=500)
@api_view(['GET'])
def movie_detail(request, movie_id):
    # Get detailed movie info from OMDb
    omdb_url = f"http://www.omdbapi.com/?i={movie_id}&apikey={settings.OMDB_API_KEY}"
    response = requests.get(omdb_url)
    return JsonResponse(response.json())

@api_view(['POST'])
def toggle_like(request, movie_id):
    # Save user like to database
    # Update like count
    pass

@api_view(['POST'])
def update_watched(request, movie_id):
    # Save watched status to database
    pass

@api_view(['POST'])
def update_rating(request, movie_id):
    # Save user rating to database
    pass