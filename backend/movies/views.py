# movies/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
import requests
from django.conf import settings
from .models import Movie, MovieReview, UserMovieInteraction
from django.shortcuts import get_object_or_404
from django.db.models import Avg, Count

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


# ============= REVIEW ENDPOINTS =============

@api_view(['POST'])
@csrf_exempt
@permission_classes([IsAuthenticated])
def create_review(request):
    """Create or update a movie review"""
    try:
        imdb_id = request.data.get('imdb_id')
        rating = request.data.get('rating')
        review_text = request.data.get('review_text', '')
        
        # Validation
        if not imdb_id or not rating:
            return Response({'error': 'imdb_id and rating are required'}, status=400)
        
        if not (1 <= int(rating) <= 5):
            return Response({'error': 'Rating must be between 1 and 5'}, status=400)
        
        # Get or create movie from OMDb
        movie, created = Movie.objects.get_or_create(
            imdb_id=imdb_id,
            defaults={'title': request.data.get('title', 'Unknown')}
        )
        
        # If movie was just created, fetch full details from OMDb
        if created:
            api_key = settings.OMDB_API_KEY
            if api_key:
                try:
                    url = f'http://www.omdbapi.com/?i={imdb_id}&apikey={api_key}'
                    response = requests.get(url)
                    data = response.json()
                    
                    if data.get('Response') == 'True':
                        movie.title = data.get('Title', movie.title)
                        movie.year = data.get('Year', '')
                        movie.genre = data.get('Genre', '')
                        movie.director = data.get('Director', '')
                        movie.actors = data.get('Actors', '')
                        movie.plot = data.get('Plot', '')
                        movie.poster = data.get('Poster', '')
                        movie.imdb_rating = data.get('imdbRating', '')
                        movie.runtime = data.get('Runtime', '')
                        movie.save()
                except Exception as e:
                    print(f"Error fetching movie details: {e}")
        
        # Create or update review
        review, created = MovieReview.objects.update_or_create(
            user=request.user,
            movie=movie,
            defaults={
                'rating': rating,
                'review_text': review_text
            }
        )
        
        return Response({
            'success': True,
            'message': 'Review created successfully' if created else 'Review updated successfully',
            'review': {
                'id': review.id,
                'rating': review.rating,
                'review_text': review.review_text,
                'created_at': review.created_at,
                'updated_at': review.updated_at,
                'movie': {
                    'imdb_id': movie.imdb_id,
                    'title': movie.title,
                    'year': movie.year,
                    'poster': movie.poster
                }
            }
        }, status=201 if created else 200)
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
def get_movie_reviews(request, imdb_id):
    """Get all reviews for a specific movie"""
    try:
        movie = get_object_or_404(Movie, imdb_id=imdb_id)
        reviews = MovieReview.objects.filter(movie=movie).select_related('user')
        
        reviews_data = [{
            'id': review.id,
            'user': {
                'id': review.user.id,
                'username': review.user.username
            },
            'rating': review.rating,
            'review_text': review.review_text,
            'created_at': review.created_at,
            'updated_at': review.updated_at
        } for review in reviews]
        
        # Calculate average rating
        total_ratings = sum(r.rating for r in reviews)
        avg_rating = total_ratings / len(reviews) if reviews else 0
        
        return Response({
            'reviews': reviews_data,
            'total_reviews': len(reviews),
            'average_rating': round(avg_rating, 1)
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_reviews(request):
    """Get all reviews by the authenticated user"""
    try:
        reviews = MovieReview.objects.filter(user=request.user).select_related('movie')
        
        reviews_data = [{
            'id': review.id,
            'rating': review.rating,
            'review_text': review.review_text,
            'created_at': review.created_at,
            'updated_at': review.updated_at,
            'movie': {
                'imdb_id': review.movie.imdb_id,
                'title': review.movie.title,
                'year': review.movie.year,
                'poster': review.movie.poster,
                'genre': review.movie.genre
            }
        } for review in reviews]
        
        return Response({
            'reviews': reviews_data,
            'total_reviews': len(reviews)
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['DELETE'])
@csrf_exempt
@permission_classes([IsAuthenticated])
def delete_review(request, review_id):
    """Delete a user's review"""
    try:
        review = get_object_or_404(MovieReview, id=review_id, user=request.user)
        review.delete()
        
        return Response({
            'success': True,
            'message': 'Review deleted successfully'
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)


# ============= WATCH STATE & LIBRARY ENDPOINTS =============

@api_view(['POST'])
@csrf_exempt
@permission_classes([IsAuthenticated])
def toggle_watch_state(request):
    """Mark movie as watched or want to watch"""
    try:
        imdb_id = request.data.get('imdb_id')
        state = request.data.get('state')  # 'watched' or 'want_to_watch'
        
        if state not in ['watched', 'want_to_watch']:
            return Response({'error': 'State must be "watched" or "want_to_watch"'}, status=400)
        
        # Get or create movie
        movie, created = Movie.objects.get_or_create(
            imdb_id=imdb_id,
            defaults={
                'title': request.data.get('title', 'Unknown'),
                'year': request.data.get('year', ''),
                'poster': request.data.get('poster', ''),
                'genre': request.data.get('genre', ''),
            }
        )
        
        # Fetch full details if just created
        if created and settings.OMDB_API_KEY:
            try:
                url = f'http://www.omdbapi.com/?i={imdb_id}&apikey={settings.OMDB_API_KEY}'
                response = requests.get(url)
                data = response.json()
                if data.get('Response') == 'True':
                    movie.title = data.get('Title', movie.title)
                    movie.year = data.get('Year', '')
                    movie.genre = data.get('Genre', '')
                    movie.director = data.get('Director', '')
                    movie.actors = data.get('Actors', '')
                    movie.plot = data.get('Plot', '')
                    movie.poster = data.get('Poster', '')
                    movie.imdb_rating = data.get('imdbRating', '')
                    movie.runtime = data.get('Runtime', '')
                    movie.save()
            except Exception as e:
                print(f"Error fetching movie details: {e}")
        
        # Toggle the state
        interaction, created = UserMovieInteraction.objects.get_or_create(
            user=request.user,
            movie=movie,
            interaction_type=state
        )
        
        if not created:
            # If it already exists, remove it (toggle off)
            interaction.delete()
            return Response({
                'success': True,
                'action': 'removed',
                'state': state
            })
        
        # If adding 'watched', remove 'want_to_watch'
        if state == 'watched':
            UserMovieInteraction.objects.filter(
                user=request.user,
                movie=movie,
                interaction_type='want_to_watch'
            ).delete()
        # If adding 'want_to_watch', remove 'watched'
        elif state == 'want_to_watch':
            UserMovieInteraction.objects.filter(
                user=request.user,
                movie=movie,
                interaction_type='watched'
            ).delete()
        
        return Response({
            'success': True,
            'action': 'added',
            'state': state
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
@csrf_exempt
@permission_classes([IsAuthenticated])
def toggle_like(request):
    """Toggle like or love on a movie"""
    try:
        imdb_id = request.data.get('imdb_id')
        like_type = request.data.get('type')  # 'like' or 'love'
        
        if like_type not in ['like', 'love']:
            return Response({'error': 'Type must be "like" or "love"'}, status=400)
        
        movie = get_object_or_404(Movie, imdb_id=imdb_id)
        
        # Check if already exists
        interaction = UserMovieInteraction.objects.filter(
            user=request.user,
            movie=movie,
            interaction_type=like_type
        ).first()
        
        if interaction:
            # Remove it (toggle off)
            interaction.delete()
            return Response({
                'success': True,
                'action': 'removed',
                'type': like_type
            })
        else:
            # Add it
            UserMovieInteraction.objects.create(
                user=request.user,
                movie=movie,
                interaction_type=like_type
            )
            
            # If adding 'love', remove 'like'
            if like_type == 'love':
                UserMovieInteraction.objects.filter(
                    user=request.user,
                    movie=movie,
                    interaction_type='like'
                ).delete()
            # If adding 'like', remove 'love'
            elif like_type == 'like':
                UserMovieInteraction.objects.filter(
                    user=request.user,
                    movie=movie,
                    interaction_type='love'
                ).delete()
            
            return Response({
                'success': True,
                'action': 'added',
                'type': like_type
            })
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_library(request):
    """Get user's watched movies, want to watch list, and liked movies"""
    try:
        # Get all interactions
        watched = UserMovieInteraction.objects.filter(
            user=request.user,
            interaction_type='watched'
        ).select_related('movie')
        
        want_to_watch = UserMovieInteraction.objects.filter(
            user=request.user,
            interaction_type='want_to_watch'
        ).select_related('movie')
        
        loved = UserMovieInteraction.objects.filter(
            user=request.user,
            interaction_type='love'
        ).select_related('movie')
        
        # Get user's reviews for ratings
        reviews = {r.movie.imdb_id: r for r in MovieReview.objects.filter(user=request.user)}
        
        def format_movie(interaction):
            movie = interaction.movie
            review = reviews.get(movie.imdb_id)
            return {
                'imdb_id': movie.imdb_id,
                'title': movie.title,
                'year': movie.year,
                'poster': movie.poster,
                'genre': movie.genre,
                'rating': review.rating if review else None,
                'review_text': review.review_text if review else None,
                'added_at': interaction.created_at
            }
        
        return Response({
            'success': True,
            'library': {
                'watched': [format_movie(i) for i in watched],
                'want_to_watch': [format_movie(i) for i in want_to_watch],
                'loved': [format_movie(i) for i in loved],
            },
            'total_watched': watched.count(),
            'total_want_to_watch': want_to_watch.count()
        })
        
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=500)


@api_view(['GET'])
def get_movie_stats(request, imdb_id):
    """Get stats for a movie (reviews, likes, watches)"""
    try:
        movie = get_object_or_404(Movie, imdb_id=imdb_id)
        
        # Get review stats
        reviews = MovieReview.objects.filter(movie=movie)
        avg_rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 0
        
        # Get interaction counts
        watched_count = UserMovieInteraction.objects.filter(
            movie=movie, 
            interaction_type='watched'
        ).count()
        
        love_count = UserMovieInteraction.objects.filter(
            movie=movie,
            interaction_type='love'
        ).count()
        
        # Get current user's interactions if authenticated
        user_interactions = {}
        if request.user.is_authenticated:
            interactions = UserMovieInteraction.objects.filter(
                user=request.user,
                movie=movie
            )
            user_interactions = {i.interaction_type: True for i in interactions}
            
            # Check if user has reviewed
            user_review = MovieReview.objects.filter(
                user=request.user,
                movie=movie
            ).first()
            
            if user_review:
                user_interactions['has_reviewed'] = True
                user_interactions['user_rating'] = user_review.rating
                user_interactions['user_review_text'] = user_review.review_text
        
        return Response({
            'average_rating': round(avg_rating, 1),
            'total_reviews': reviews.count(),
            'watched_count': watched_count,
            'love_count': love_count,
            'user_interactions': user_interactions
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)


