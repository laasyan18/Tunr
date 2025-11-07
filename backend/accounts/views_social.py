"""Social features - profile, friends, activity feed"""
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count
from collections import Counter
from .models import CustomUser


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_profile(request, username=None):
    """Get user profile - own or another user's"""
    if username:
        user = get_object_or_404(CustomUser, username=username)
    else:
        user = request.user
    
    is_own_profile = (user == request.user)
    is_following = False
    
    if not is_own_profile:
        is_following = request.user.following.filter(id=user.id).exists()
    
    # Get user's stats
    from movies.models import MovieReview, UserMovieInteraction
    watched_count = UserMovieInteraction.objects.filter(
        user=user, 
        interaction_type='watched'
    ).count()
    
    reviews_count = MovieReview.objects.filter(user=user).count()
    
    profile_data = {
        'username': user.username,
        'email': user.email if is_own_profile else None,
        'bio': user.bio,
        'created_at': user.created_at,
        'spotify_connected': bool(user.spotify_access_token),
        'spotify_display_name': user.spotify_display_name,
        'stats': {
            'watched': watched_count,
            'reviews': reviews_count,
            'following': user.following.count(),
            'followers': user.followers.count(),
        },
        'is_own_profile': is_own_profile,
        'is_following': is_following,
    }
    
    return Response(profile_data)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_activity(request, username=None):
    """Get user's activity feed - movies watched, songs listened to, ratings, etc."""
    if username:
        user = get_object_or_404(CustomUser, username=username)
    else:
        user = request.user
    
    from movies.models import MovieReview, UserMovieInteraction
    activities = []
    
    # Get movie reviews (ratings)
    movie_reviews = MovieReview.objects.filter(user=user).select_related('movie').order_by('-created_at')[:20]
    for review in movie_reviews:
        activities.append({
            'type': 'rated_movie',
            'timestamp': review.created_at,
            'movie': {
                'imdb_id': review.movie.imdb_id,
                'title': review.movie.title,
                'year': review.movie.year,
                'poster_url': review.movie.poster_url,
            },
            'rating': review.rating,
            'review_text': review.review_text if review.review_text else None,
        })
    
    # Get watched movies
    watched = UserMovieInteraction.objects.filter(
        user=user,
        interaction_type='watched'
    ).select_related('movie').order_by('-created_at')[:20]
    
    for watch in watched:
        # Skip if we already have a review for this movie (to avoid duplicates)
        if not any(a.get('movie', {}).get('imdb_id') == watch.movie.imdb_id for a in activities):
            activities.append({
                'type': 'watched_movie',
                'timestamp': watch.created_at,
                'movie': {
                    'imdb_id': watch.movie.imdb_id,
                    'title': watch.movie.title,
                    'year': watch.movie.year,
                    'poster_url': watch.movie.poster_url,
                },
            })
    
    # Get liked movies
    liked = UserMovieInteraction.objects.filter(
        user=user,
        interaction_type='liked'
    ).select_related('movie').order_by('-created_at')[:20]
    
    for like in liked:
        if not any(a.get('movie', {}).get('imdb_id') == like.movie.imdb_id for a in activities):
            activities.append({
                'type': 'liked_movie',
                'timestamp': like.created_at,
                'movie': {
                    'imdb_id': like.movie.imdb_id,
                    'title': like.movie.title,
                    'year': like.movie.year,
                    'poster_url': like.movie.poster_url,
                },
            })
    
    # Sort all activities by timestamp
    activities.sort(key=lambda x: x['timestamp'], reverse=True)
    
    # Return top 50 activities
    return Response({
        'activities': activities[:50],
        'username': user.username
    })


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def toggle_follow(request, username):
    """Follow/unfollow a user"""
    user_to_follow = get_object_or_404(CustomUser, username=username)
    
    if user_to_follow == request.user:
        return Response({'error': 'Cannot follow yourself'}, status=400)
    
    if request.user.following.filter(id=user_to_follow.id).exists():
        request.user.following.remove(user_to_follow)
        return Response({'following': False, 'message': f'Unfollowed {username}'})
    else:
        request.user.following.add(user_to_follow)
        return Response({'following': True, 'message': f'Now following {username}'})


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_friends_activity(request):
    """Get activity feed from users you follow"""
    following_users = request.user.following.all()
    
    # Get activities from followed users
    activities = UserActivity.objects.filter(
        user__in=following_users
    )[:50]  # Last 50 activities
    
    activity_data = []
    for activity in activities:
        activity_data.append({
            'id': activity.id,
            'username': activity.user.username,
            'activity_type': activity.activity_type,
            'movie_id': activity.movie_id,
            'movie_title': activity.movie_title,
            'movie_poster': activity.movie_poster,
            'rating': activity.rating,
            'review_text': activity.review_text,
            'song_name': activity.song_name,
            'song_artist': activity.song_artist,
            'created_at': activity.created_at,
        })
    
    return Response({
        'activities': activity_data,
        'count': len(activity_data)
    })


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def search_users(request):
    """Search for users to follow"""
    query = request.GET.get('q', '').strip()
    
    # If no query, return suggested users (not following yet)
    if not query:
        users = CustomUser.objects.exclude(
            id=request.user.id
        ).exclude(
            id__in=request.user.following.values_list('id', flat=True)
        ).annotate(
            follower_count=Count('followers')
        ).order_by('-follower_count')[:20]
    else:
        # Search by username or email - CASE INSENSITIVE
        users = CustomUser.objects.filter(
            Q(username__icontains=query) | Q(email__icontains=query)
        ).exclude(id=request.user.id)[:20]
    
    user_data = []
    for user in users:
        user_data.append({
            'username': user.username,
            'bio': user.bio,
            'is_following': request.user.following.filter(id=user.id).exists(),
            'followers_count': user.followers.count(),
        })
    
    return Response({'users': user_data})


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_following(request, username=None):
    """Get list of users that this user follows"""
    if username:
        user = get_object_or_404(CustomUser, username=username)
    else:
        user = request.user
    
    following = user.following.all()
    
    following_data = []
    for followed_user in following:
        following_data.append({
            'username': followed_user.username,
            'bio': followed_user.bio,
            'is_following': request.user.following.filter(id=followed_user.id).exists() if user != request.user else True,
        })
    
    return Response({'following': following_data})


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_followers(request, username=None):
    """Get list of users following this user"""
    if username:
        user = get_object_or_404(CustomUser, username=username)
    else:
        user = request.user
    
    followers = user.followers.all()
    
    followers_data = []
    for follower in followers:
        followers_data.append({
            'username': follower.username,
            'bio': follower.bio,
            'is_following': request.user.following.filter(id=follower.id).exists(),
        })
    
    return Response({'followers': followers_data})


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_friend_recommendations(request):
    """
    Recommend friends based on:
    1. Similar movie reviews (taste similarity)
    2. Common movie genres watched
    3. Common directors/cast preferences
    """
    from movies.models import MovieReview, UserMovieInteraction, Movie
    
    current_user = request.user
    recommendations = []
    
    # Get user's reviewed movies
    user_reviews = MovieReview.objects.filter(user=current_user).select_related('movie')
    
    if not user_reviews.exists():
        # No reviews yet, just return popular users
        popular_users = CustomUser.objects.exclude(
            id=current_user.id
        ).exclude(
            id__in=current_user.following.values_list('id', flat=True)
        ).annotate(
            follower_count=Count('followers')
        ).order_by('-follower_count')[:10]
        
        for user in popular_users:
            recommendations.append({
                'username': user.username,
                'bio': user.bio,
                'reason': f'{user.followers.count()} followers',
                'score': user.followers.count(),
                'is_following': False,
            })
        
        return Response({'recommendations': recommendations})
    
    # Extract user's preferences
    user_movie_ids = set(user_reviews.values_list('movie_id', flat=True))
    user_genres = []
    user_directors = []
    user_actors = []
    
    for review in user_reviews:
        if review.movie.genre:
            user_genres.extend([g.strip() for g in review.movie.genre.split(',')])
        if review.movie.director:
            user_directors.extend([d.strip() for d in review.movie.director.split(',')])
        if review.movie.actors:
            user_actors.extend([a.strip() for a in review.movie.actors.split(',')])
    
    # Count preferences
    genre_counter = Counter(user_genres)
    director_counter = Counter(user_directors)
    actor_counter = Counter(user_actors)
    
    # Find other users with similar tastes
    other_users = CustomUser.objects.exclude(
        id=current_user.id
    ).exclude(
        id__in=current_user.following.values_list('id', flat=True)
    )
    
    user_scores = {}
    
    for other_user in other_users:
        score = 0
        reasons = []
        
        # Check if they reviewed the same movies
        other_reviews = MovieReview.objects.filter(user=other_user).select_related('movie')
        other_movie_ids = set(other_reviews.values_list('movie_id', flat=True))
        
        common_movies = user_movie_ids & other_movie_ids
        if common_movies:
            score += len(common_movies) * 10  # 10 points per common movie
            reasons.append(f'{len(common_movies)} movies in common')
        
        # Check genre similarity
        other_genres = []
        other_directors = []
        other_actors = []
        
        for review in other_reviews:
            if review.movie.genre:
                other_genres.extend([g.strip() for g in review.movie.genre.split(',')])
            if review.movie.director:
                other_directors.extend([d.strip() for d in review.movie.director.split(',')])
            if review.movie.actors:
                other_actors.extend([a.strip() for a in review.movie.actors.split(',')])
        
        # Score genres
        common_genres = set(user_genres) & set(other_genres)
        if common_genres:
            score += len(common_genres) * 3
            top_genre = max(common_genres, key=lambda g: genre_counter.get(g, 0))
            reasons.append(f'Both love {top_genre}')
        
        # Score directors
        common_directors = set(user_directors) & set(other_directors)
        if common_directors:
            score += len(common_directors) * 5
            top_director = max(common_directors, key=lambda d: director_counter.get(d, 0))
            reasons.append(f'Both like {top_director}')
        
        # Score actors
        common_actors = set(user_actors) & set(other_actors)
        if common_actors:
            score += len(common_actors) * 2
            if len(common_actors) >= 3:
                reasons.append(f'{len(common_actors)} favorite actors in common')
        
        # Only recommend if there's some similarity
        if score > 0:
            user_scores[other_user] = {
                'score': score,
                'reasons': reasons[:2],  # Top 2 reasons
            }
    
    # Sort by score and get top 20
    sorted_users = sorted(user_scores.items(), key=lambda x: x[1]['score'], reverse=True)[:20]
    
    for user, data in sorted_users:
        reason_text = ' • '.join(data['reasons']) if data['reasons'] else 'Similar taste'
        recommendations.append({
            'username': user.username,
            'bio': user.bio,
            'reason': reason_text,
            'score': data['score'],
            'is_following': False,
        })
    
    return Response({'recommendations': recommendations})


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_personalized_movie_recommendations(request):
    """
    Recommend movies based on:
    1. User's highly rated movies (similar genre, director, cast)
    2. Movies loved by people they follow
    3. Popular movies in their favorite genres
    """
    from movies.models import MovieReview, Movie
    from django.db.models import Avg, Count, Q
    
    current_user = request.user
    recommendations = []
    seen_movie_ids = set()
    
    # Get user's watched movies
    user_reviews = MovieReview.objects.filter(user=current_user).select_related('movie')
    watched_movie_ids = set(user_reviews.values_list('movie_id', flat=True))
    
    # Get user's highly rated movies (4-5 stars)
    highly_rated = user_reviews.filter(rating__gte=4).select_related('movie')
    
    if highly_rated.exists():
        # Extract user's favorite genres, directors, actors
        favorite_genres = []
        favorite_directors = []
        favorite_actors = []
        
        for review in highly_rated:
            if review.movie.genre:
                favorite_genres.extend([g.strip() for g in review.movie.genre.split(',')])
            if review.movie.director:
                favorite_directors.extend([d.strip() for d in review.movie.director.split(',')])
            if review.movie.actors:
                favorite_actors.extend([a.strip() for a in review.movie.actors.split(',')])
        
        # Get most common preferences
        from collections import Counter
        top_genres = [g for g, _ in Counter(favorite_genres).most_common(3)]
        top_directors = [d for d, _ in Counter(favorite_directors).most_common(3)]
        top_actors = [a for a, _ in Counter(favorite_actors).most_common(5)]
        
        # Find movies with similar attributes
        similar_movies_query = Q()
        for genre in top_genres:
            similar_movies_query |= Q(genre__icontains=genre)
        for director in top_directors:
            similar_movies_query |= Q(director__icontains=director)
        for actor in top_actors[:3]:  # Top 3 actors only
            similar_movies_query |= Q(actors__icontains=actor)
        
        similar_movies = Movie.objects.filter(
            similar_movies_query
        ).exclude(
            imdb_id__in=watched_movie_ids
        ).annotate(
            avg_rating=Avg('reviews__rating'),
            review_count=Count('reviews')
        ).order_by('-avg_rating', '-review_count')[:15]
        
        for movie in similar_movies:
            # Filter by year - only from 1995 onwards
            try:
                year_int = int(movie.year.split('–')[0].split('-')[0]) if movie.year else 0
                if year_int < 1995:
                    continue
            except (ValueError, TypeError, AttributeError):
                pass  # Include if year parsing fails
            
            if movie.imdb_id not in seen_movie_ids:
                reason = []
                if any(g in (movie.genre or '') for g in top_genres):
                    matching_genre = next(g for g in top_genres if g in (movie.genre or ''))
                    reason.append(f"{matching_genre}")
                if any(d in (movie.director or '') for d in top_directors):
                    reason.append("Favorite Director")
                if any(a in (movie.actors or '') for a in top_actors[:2]):
                    reason.append("Favorite Actor")
                
                recommendations.append({
                    'imdb_id': movie.imdb_id,
                    'title': movie.title,
                    'year': movie.year,
                    'genre': movie.genre,
                    'director': movie.director,
                    'poster': movie.poster,
                    'imdb_rating': movie.imdb_rating,
                    'reason': ' • '.join(reason[:2]) if reason else 'Based on your taste',
                    'avg_user_rating': round(movie.avg_rating, 1) if movie.avg_rating else None,
                })
                seen_movie_ids.add(movie.imdb_id)
    
    # Get movies loved by people user follows
    following_users = current_user.following.all()
    if following_users.exists():
        friend_favorites = MovieReview.objects.filter(
            user__in=following_users,
            rating__gte=4
        ).exclude(
            movie_id__in=watched_movie_ids
        ).values('movie').annotate(
            love_count=Count('id'),
            avg_rating=Avg('rating')
        ).order_by('-love_count', '-avg_rating')[:10]
        
        for item in friend_favorites:
            movie = Movie.objects.get(imdb_id=item['movie'])
            
            # Filter by year - only from 1995 onwards
            try:
                year_int = int(movie.year.split('–')[0].split('-')[0]) if movie.year else 0
                if year_int < 1995:
                    continue
            except (ValueError, TypeError, AttributeError):
                pass
            
            if movie.imdb_id not in seen_movie_ids:
                recommendations.append({
                    'imdb_id': movie.imdb_id,
                    'title': movie.title,
                    'year': movie.year,
                    'genre': movie.genre,
                    'director': movie.director,
                    'poster': movie.poster,
                    'imdb_rating': movie.imdb_rating,
                    'reason': f'{item["love_count"]} friend{"s" if item["love_count"] > 1 else ""} loved this',
                    'avg_user_rating': round(item['avg_rating'], 1),
                })
                seen_movie_ids.add(movie.imdb_id)
    
    # If still no recommendations, show popular movies
    if len(recommendations) < 5:
        popular_movies = Movie.objects.exclude(
            imdb_id__in=watched_movie_ids
        ).annotate(
            avg_rating=Avg('reviews__rating'),
            review_count=Count('reviews')
        ).filter(
            review_count__gte=1
        ).order_by('-review_count', '-avg_rating')[:10]
        
        for movie in popular_movies:
            # Filter by year - only from 1995 onwards
            try:
                year_int = int(movie.year.split('–')[0].split('-')[0]) if movie.year else 0
                if year_int < 1995:
                    continue
            except (ValueError, TypeError, AttributeError):
                pass
            
            if movie.imdb_id not in seen_movie_ids:
                recommendations.append({
                    'imdb_id': movie.imdb_id,
                    'title': movie.title,
                    'year': movie.year,
                    'genre': movie.genre,
                    'director': movie.director,
                    'poster': movie.poster,
                    'imdb_rating': movie.imdb_rating,
                    'reason': 'Popular on Tunr',
                    'avg_user_rating': round(movie.avg_rating, 1) if movie.avg_rating else None,
                })
                seen_movie_ids.add(movie.imdb_id)
    
    # If STILL no recommendations (empty DB), fetch from OMDb API based on user preferences
    if len(recommendations) == 0:
        from django.conf import settings
        import requests
        
        api_key = settings.OMDB_API_KEY
        if api_key:
            search_queries = []
            
            if highly_rated.exists():
                # Search by favorite genres (works better than actor/director names)
                if top_genres:
                    for genre in top_genres[:2]:
                        search_queries.append(f'{genre}')
                
                # Search by combining genre + year range for better results
                if top_genres:
                    search_queries.append(f'{top_genres[0]} 2020')
                    search_queries.append(f'{top_genres[0]} 2015')
            else:
                # New user - show popular recent movies
                search_queries = ['comedy 2024', 'action 2023', 'romance 2024', 'thriller 2023']
            
            for query in search_queries[:4]:  # Limit to 4 searches
                try:
                    url = f'http://www.omdbapi.com/?s={query}&type=movie&apikey={api_key}'
                    response = requests.get(url, timeout=5)
                    data = response.json()
                    
                    if data.get('Response') == 'True':
                        movies = data.get('Search', [])
                        
                        # Process MORE movies to increase chance of finding matches
                        for movie_data in movies[:10]:  # Check 10 movies per search instead of default
                            imdb_id = movie_data.get('imdbID')
                            movie_year = movie_data.get('Year', '')
                            
                            if imdb_id not in seen_movie_ids and imdb_id not in watched_movie_ids:
                                # Fetch full details for better recommendations
                                try:
                                    detail_url = f'http://www.omdbapi.com/?i={imdb_id}&apikey={api_key}'
                                    detail_response = requests.get(detail_url, timeout=5)
                                    detail_data = detail_response.json()
                                    
                                    if detail_data.get('Response') == 'True':
                                        # Filter by year - only movies from 1995 onwards
                                        movie_year = detail_data.get('Year', '')
                                        try:
                                            # Handle year formats like "2024" or "2020-2021"
                                            year_int = int(movie_year.split('–')[0].split('-')[0])
                                            if year_int < 1995:
                                                continue  # Skip old movies
                                        except (ValueError, TypeError, AttributeError):
                                            continue  # Skip if no valid year
                                        
                                        # Only include if IMDb rating is good (≥ 5.0)
                                        imdb_rating = detail_data.get('imdbRating', 'N/A')
                                        try:
                                            rating_float = float(imdb_rating)
                                            if rating_float < 5.0:
                                                continue  # Skip low-rated movies
                                        except (ValueError, TypeError):
                                            continue  # Skip if no valid rating
                                        
                                        reason_parts = []
                                        
                                        # Check if director matches (EXACT match)
                                        movie_director = detail_data.get('Director', '')
                                        if top_directors and movie_director:
                                            for d in top_directors[:2]:
                                                if d.lower() in movie_director.lower():
                                                    reason_parts.append('Favorite Director')
                                                    break
                                        
                                        # Check if actors match (EXACT match in Actors field)
                                        movie_actors = detail_data.get('Actors', '')
                                        if top_actors and movie_actors:
                                            for a in top_actors[:3]:
                                                if a.lower() in movie_actors.lower():
                                                    reason_parts.append('Favorite Actor')
                                                    break
                                        
                                        # Check if genre matches (EXACT match in Genre field)
                                        movie_genre = detail_data.get('Genre', '')
                                        if top_genres and movie_genre:
                                            for g in top_genres:
                                                if g.lower() in movie_genre.lower():
                                                    reason_parts.append(g)
                                                    break
                                        
                                        # Only add if it matches at least ONE preference (actor, director, or genre)
                                        if not reason_parts:
                                            continue  # Skip movies that don't match any preferences
                                        
                                        reason = ' • '.join(reason_parts) if reason_parts else 'Highly Rated'
                                        
                                        recommendations.append({
                                            'imdb_id': imdb_id,
                                            'title': detail_data.get('Title', ''),
                                            'year': detail_data.get('Year', ''),
                                            'genre': detail_data.get('Genre', ''),
                                            'director': detail_data.get('Director', ''),
                                            'poster': detail_data.get('Poster', ''),
                                            'imdb_rating': imdb_rating,
                                            'reason': reason,
                                            'avg_user_rating': None,
                                            '_rating_sort': rating_float,  # For sorting
                                        })
                                        seen_movie_ids.add(imdb_id)
                                except Exception as e:
                                    print(f"Error fetching movie details: {e}")
                                    continue
                                
                        if len(recommendations) >= 10:
                            break
                except Exception as e:
                    print(f"Error fetching from OMDb: {e}")
                    continue
    
    # If still nothing, return helpful message
    if len(recommendations) == 0:
        return Response({
            'recommendations': [],
            'message': 'Rate some movies to get personalized suggestions!'
        })
    
    # Sort by IMDb rating (highest first)
    recommendations.sort(key=lambda x: x.get('_rating_sort', 0), reverse=True)
    
    # Remove the sorting key before returning
    for rec in recommendations:
        rec.pop('_rating_sort', None)
    
    return Response({'recommendations': recommendations[:20]})


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_personalized_music_recommendations(request):
    """
    Recommend music based on friends' listening activity
    Shows trending songs among friends - recently played and liked songs
    """
    from music.models import LikedSong, RecentlyPlayed
    from django.db.models import Count, Q
    from datetime import timedelta
    from django.utils import timezone
    
    current_user = request.user
    friends = current_user.following.all()
    
    if not friends.exists():
        return Response({
            'recommendations': [],
            'message': 'Follow friends to see what they\'re listening to!'
        })
    
    recommendations = []
    seen_track_ids = set()
    
    # Get songs user has already liked (to avoid duplicates)
    user_liked_ids = set(
        LikedSong.objects.filter(user=current_user).values_list('spotify_track_id', flat=True)
    )
    
    # 1. Get recently played songs from friends (last 7 days)
    week_ago = timezone.now() - timedelta(days=7)
    recent_plays = RecentlyPlayed.objects.filter(
        user__in=friends,
        played_at__gte=week_ago
    ).exclude(
        spotify_track_id__in=user_liked_ids
    ).values(
        'spotify_track_id', 'track_name', 'artist_name', 'album_name', 'album_image_url'
    ).annotate(
        play_count=Count('id'),
        friend_count=Count('user', distinct=True)
    ).order_by('-play_count', '-friend_count')[:15]
    
    for track in recent_plays:
        if track['spotify_track_id'] not in seen_track_ids:
            recommendations.append({
                'type': 'trending',
                'spotify_track_id': track['spotify_track_id'],
                'track_name': track['track_name'],
                'artist_name': track['artist_name'],
                'album_name': track['album_name'],
                'album_image_url': track['album_image_url'],
                'reason': f"{track['friend_count']} friend{'s' if track['friend_count'] > 1 else ''} listened",
                'play_count': track['play_count'],
            })
            seen_track_ids.add(track['spotify_track_id'])
    
    # 2. Get liked songs from friends (most recent)
    friend_likes = LikedSong.objects.filter(
        user__in=friends
    ).exclude(
        spotify_track_id__in=user_liked_ids
    ).exclude(
        spotify_track_id__in=seen_track_ids
    ).select_related('user').order_by('-liked_at')[:20]
    
    for like in friend_likes:
        if like.spotify_track_id not in seen_track_ids:
            recommendations.append({
                'type': 'liked',
                'spotify_track_id': like.spotify_track_id,
                'track_name': like.track_name,
                'artist_name': like.artist_name,
                'album_name': like.album_name,
                'album_image_url': like.album_image_url or '',
                'reason': f"@{like.user.username} liked this",
                'liked_by': like.user.username,
            })
            seen_track_ids.add(like.spotify_track_id)
    
    if len(recommendations) == 0:
        return Response({
            'recommendations': [],
            'message': 'Your friends haven\'t been active on Spotify recently. Check back later!'
        })
    
    return Response({
        'recommendations': recommendations[:25],
        'message': f'Found {len(recommendations)} songs from your friends!'
    })


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_friend_movie_recommendations(request):
    """
    Recommendations based on friends' activity:
    - Movies rated 4+ stars
    - Loved movies
    - Watchlist items (what friends want to watch)
    """
    from movies.models import MovieReview, UserMovieInteraction
    
    current_user = request.user
    friends = current_user.following.all()
    
    if not friends.exists():
        return Response({'recommendations': []})
    
    # Get movies user hasn't watched yet
    user_watched_ids = set(
        MovieReview.objects.filter(user=current_user).values_list('movie_id', flat=True)
    )
    
    recommendations = []
    seen_movies = set()
    
    # 1. Get highly rated movies from friends (4-5 stars)
    friend_reviews = MovieReview.objects.filter(
        user__in=friends,
        rating__gte=4
    ).select_related('movie', 'user').order_by('-created_at')[:50]
    
    for review in friend_reviews:
        movie = review.movie
        if movie.imdb_id in seen_movies or movie.imdb_id in user_watched_ids:
            continue
        
        seen_movies.add(movie.imdb_id)
        recommendations.append({
            'imdb_id': movie.imdb_id,
            'title': movie.title,
            'year': movie.year,
            'genre': movie.genre,
            'poster_url': movie.poster,
            'imdb_rating': movie.imdb_rating,
            'reason': f"@{review.user.username} rated {review.rating}★",
            'user_rating': review.rating,
            'type': 'rated'
        })
    
    # 2. Get loved movies from friends
    loved_movies = UserMovieInteraction.objects.filter(
        user__in=friends,
        interaction_type='love'
    ).select_related('movie', 'user').order_by('-created_at')[:30]
    
    for interaction in loved_movies:
        movie = interaction.movie
        if movie.imdb_id in seen_movies or movie.imdb_id in user_watched_ids:
            continue
        
        seen_movies.add(movie.imdb_id)
        recommendations.append({
            'imdb_id': movie.imdb_id,
            'title': movie.title,
            'year': movie.year,
            'genre': movie.genre,
            'poster_url': movie.poster,
            'imdb_rating': movie.imdb_rating,
            'reason': f"♥ @{interaction.user.username} loved this",
            'type': 'loved'
        })
    
    # 3. Get watchlist items from friends
    watchlist_movies = UserMovieInteraction.objects.filter(
        user__in=friends,
        interaction_type='want_to_watch'
    ).select_related('movie', 'user').order_by('-created_at')[:20]
    
    for interaction in watchlist_movies:
        movie = interaction.movie
        if movie.imdb_id in seen_movies or movie.imdb_id in user_watched_ids:
            continue
        
        seen_movies.add(movie.imdb_id)
        recommendations.append({
            'imdb_id': movie.imdb_id,
            'title': movie.title,
            'year': movie.year,
            'genre': movie.genre,
            'poster_url': movie.poster,
            'imdb_rating': movie.imdb_rating,
            'reason': f"📌 @{interaction.user.username} wants to watch",
            'type': 'watchlist'
        })
    
    # Limit to 30 recommendations
    return Response({'recommendations': recommendations[:30]})


