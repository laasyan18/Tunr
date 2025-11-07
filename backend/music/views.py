# backend/music/views.py
import requests
from django.shortcuts import redirect
from django.http import JsonResponse, HttpResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import urllib.parse
from rest_framework.authtoken.models import Token
from django.utils import timezone
from datetime import timedelta
from accounts.models import CustomUser


def refresh_spotify_token(refresh_token):
    """Refresh an expired Spotify access token"""
    token_data = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': settings.SPOTIFY_CLIENT_ID,
        'client_secret': settings.SPOTIFY_CLIENT_SECRET
    }
    
    try:
        response = requests.post(
            'https://accounts.spotify.com/api/token',
            data=token_data,
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        
        if response.status_code == 200:
            tokens = response.json()
            return tokens.get('access_token'), tokens.get('expires_in')
        return None, None
    except Exception:
        return None, None


def get_valid_access_token(request):
    """Get a valid access token, refreshing if necessary"""
    # First check if user is authenticated via Token Auth
    from rest_framework.authtoken.models import Token
    
    # Try to get user from Token auth header
    user = None
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Token '):
        token_key = auth_header.split(' ')[1]
        try:
            token_obj = Token.objects.get(key=token_key)
            user = token_obj.user
        except Token.DoesNotExist:
            pass
    
    # Fall back to request.user if available
    if not user and hasattr(request, 'user') and request.user.is_authenticated:
        user = request.user
    
    # If we have a user, get their Spotify token
    if user:
        access_token = getattr(user, 'spotify_access_token', None)
        refresh_token = getattr(user, 'spotify_refresh_token', None)
        token_expires = getattr(user, 'spotify_token_expires', None)
        
        # Check if token is expired
        if token_expires and timezone.now() >= token_expires:
            # Token expired, try to refresh
            if refresh_token:
                new_access_token, expires_in = refresh_spotify_token(refresh_token)
                if new_access_token:
                    access_token = new_access_token
                    # Update user model
                    user.spotify_access_token = new_access_token
                    if expires_in:
                        user.spotify_token_expires = timezone.now() + timedelta(seconds=int(expires_in))
                    user.save()
        
        return access_token
    
    # Fall back to session-based tokens (for backwards compatibility)
    access_token = request.session.get('spotify_access_token')
    refresh_token = request.session.get('spotify_refresh_token')
    
    return access_token

@csrf_exempt
def spotify_login(request):
    """Start Spotify OAuth - redirect user to Spotify"""
    client_id = settings.SPOTIFY_CLIENT_ID
    client_secret = settings.SPOTIFY_CLIENT_SECRET
    # Validate configuration
    if not client_id or not client_secret:
        # Redirect back to frontend with helpful error so user sees why it failed
        return redirect('http://127.0.0.1:3000/music?error=missing_spotify_config')
    redirect_uri = 'http://127.0.0.1:8000/callback'
    scopes = 'user-read-private playlist-read-private user-read-email user-top-read user-read-recently-played user-follow-read streaming user-read-playback-state user-modify-playback-state'
    
    # Optional state parameter: client may pass our API token so we can link Spotify to that user after callback
    state = request.GET.get('state')

    auth_url = (
        f"https://accounts.spotify.com/authorize?"
        f"client_id={client_id}&"
        f"response_type=code&"
        f"redirect_uri={urllib.parse.quote(redirect_uri)}&"
        f"scope={urllib.parse.quote(scopes)}"
    )

    if state:
        auth_url = auth_url + f"&state={urllib.parse.quote(state)}"

    return redirect(auth_url)

@csrf_exempt
def spotify_callback(request):
    """Handle callback from Spotify with authorization code"""
    code = request.GET.get('code')
    error = request.GET.get('error')
    
    if error:
        return redirect(f'http://127.0.0.1:3000/music?error={error}')
    
    if code:
        token_data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': 'http://127.0.0.1:8000/callback',
            'client_id': settings.SPOTIFY_CLIENT_ID,
            'client_secret': settings.SPOTIFY_CLIENT_SECRET
        }
        
        response = requests.post(
            'https://accounts.spotify.com/api/token',
            data=token_data,
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        
        if response.status_code == 200:
            tokens = response.json()
            access_token = tokens['access_token']
            refresh_token = tokens.get('refresh_token')
            expires_in = tokens.get('expires_in')

            # Store tokens in session for immediate API calls
            request.session['spotify_access_token'] = access_token
            request.session['spotify_refresh_token'] = refresh_token

            # Try to fetch Spotify profile
            profile_resp = requests.get('https://api.spotify.com/v1/me', headers={'Authorization': f'Bearer {access_token}'})
            spotify_profile = None
            if profile_resp.status_code == 200:
                spotify_profile = profile_resp.json()

            # If frontend passed a `state` with our API token, link to that user
            state = request.GET.get('state')
            user_to_link = None
            if state:
                try:
                    token_obj = Token.objects.filter(key=state).first()
                    if token_obj:
                        user_to_link = token_obj.user
                except Exception:
                    user_to_link = None

            # If not found via state, fall back to request.user if authenticated
            if not user_to_link and hasattr(request, 'user') and request.user.is_authenticated:
                user_to_link = request.user

            # Attach Spotify info to the user model if we have a user
            if user_to_link and spotify_profile:
                try:
                    user_to_link.spotify_id = spotify_profile.get('id')
                    user_to_link.spotify_display_name = spotify_profile.get('display_name')
                    user_to_link.spotify_access_token = access_token
                    user_to_link.spotify_refresh_token = refresh_token
                    if expires_in:
                        user_to_link.spotify_token_expires = timezone.now() + timedelta(seconds=int(expires_in))
                    user_to_link.save()
                except Exception:
                    # If saving fails, continue but leave tokens in session
                    pass

            return redirect('http://127.0.0.1:3000/music?auth=success')
        else:
            return redirect('http://127.0.0.1:3000/music?error=token_failed')
    
    return redirect('http://127.0.0.1:3000/music?error=no_code')

@csrf_exempt
def spotify_search(request):
    """Search Spotify API"""
    query = request.GET.get('q')
    access_token = get_valid_access_token(request)

    if not access_token:
        return JsonResponse({'error': 'Not authenticated with Spotify'}, status=401)
    
    try:
        # Request 50 tracks to increase chances of finding tracks with previews
        response = requests.get(
            f'https://api.spotify.com/v1/search?q={query}&type=track&limit=50&market=US',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        
        if response.status_code == 401:
            return JsonResponse({'error': 'Spotify session expired. Please reconnect.'}, status=401)
        
        if response.status_code != 200:
            return JsonResponse({
                'error': f'Spotify API error: {response.status_code}',
                'detail': response.text[:200]
            }, status=response.status_code)
        
        return JsonResponse(response.json())
        
    except requests.exceptions.RequestException as e:
        return JsonResponse({
            'error': 'Failed to connect to Spotify',
            'detail': str(e)
        }, status=503)

@csrf_exempt
def get_user_profile(request):
    """Get current user's Spotify profile"""
    print(f"DEBUG: get_user_profile called - Method: {request.method}")
    print(f"DEBUG: User authenticated: {request.user.is_authenticated}")
    print(f"DEBUG: Session keys: {list(request.session.keys())}")
    
    access_token = get_valid_access_token(request)
    
    print(f"DEBUG: Access token retrieved: {access_token[:20] if access_token else None}...")

    if not access_token:
        print("DEBUG: No access token, returning 401")
        return JsonResponse({'error': 'Not authenticated with Spotify'}, status=401)

    try:
        print(f"DEBUG: Making request to Spotify API...")
        response = requests.get(
            'https://api.spotify.com/v1/me',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        
        print(f"DEBUG: Spotify API response status: {response.status_code}")
        
        # Check if token is invalid
        if response.status_code == 401:
            print("DEBUG: Spotify returned 401, token expired")
            return JsonResponse({'error': 'Spotify session expired. Please reconnect.'}, status=401)
        
        if response.status_code == 403:
            print(f"DEBUG: Spotify 403 response: {response.text}")
            return JsonResponse({
                'error': 'Spotify API access forbidden',
                'detail': response.text,
                'hint': 'Check if your Spotify account is added to the app allowlist in Spotify Developer Dashboard'
            }, status=403)
        
        if response.status_code != 200:
            print(f"DEBUG: Spotify API error: {response.status_code}")
            return JsonResponse({
                'error': f'Spotify API error: {response.status_code}',
                'detail': response.text[:200]
            }, status=response.status_code)
        
        print("DEBUG: Returning Spotify profile data successfully")
        return JsonResponse(response.json())
        
    except requests.exceptions.RequestException as e:
        print(f"DEBUG: Request exception: {str(e)}")
        return JsonResponse({
            'error': 'Failed to connect to Spotify',
            'detail': str(e)
        }, status=503)

@csrf_exempt
def get_user_playlists(request):
    """Get current user's playlists"""
    access_token = get_valid_access_token(request)

    if not access_token:
        return JsonResponse({'error': 'Not authenticated with Spotify'}, status=401)

    try:
        response = requests.get(
            'https://api.spotify.com/v1/me/playlists?limit=50',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        
        if response.status_code == 401:
            return JsonResponse({'error': 'Spotify session expired. Please reconnect.'}, status=401)
        
        if response.status_code != 200:
            return JsonResponse({
                'error': f'Spotify API error: {response.status_code}'
            }, status=response.status_code)
        
        return JsonResponse(response.json())
        
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': 'Failed to connect to Spotify', 'detail': str(e)}, status=503)

@csrf_exempt
def get_top_tracks(request):
    """Get user's top tracks"""
    access_token = get_valid_access_token(request)

    if not access_token:
        return JsonResponse({'error': 'Not authenticated with Spotify'}, status=401)

    try:
        response = requests.get(
            'https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=short_term',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        
        if response.status_code == 401:
            return JsonResponse({'error': 'Spotify session expired. Please reconnect.'}, status=401)
        
        if response.status_code != 200:
            return JsonResponse({
                'error': f'Spotify API error: {response.status_code}'
            }, status=response.status_code)
        
        return JsonResponse(response.json())
        
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': 'Failed to connect to Spotify', 'detail': str(e)}, status=503)

@csrf_exempt
def get_recently_played(request):
    """Get user's recently played tracks"""
    access_token = get_valid_access_token(request)

    if not access_token:
        return JsonResponse({'error': 'Not authenticated with Spotify'}, status=401)

    try:
        response = requests.get(
            'https://api.spotify.com/v1/me/player/recently-played?limit=50',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        
        if response.status_code == 401:
            return JsonResponse({'error': 'Spotify session expired. Please reconnect.'}, status=401)
        
        if response.status_code != 200:
            return JsonResponse({
                'error': f'Spotify API error: {response.status_code}'
            }, status=response.status_code)
        
        return JsonResponse(response.json())
        
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': 'Failed to connect to Spotify', 'detail': str(e)}, status=503)

@csrf_exempt
def get_following(request):
    """Get artists user is following"""
    access_token = get_valid_access_token(request)

    if not access_token:
        return JsonResponse({'error': 'Not authenticated with Spotify'}, status=401)

    try:
        response = requests.get(
            'https://api.spotify.com/v1/me/following?type=artist&limit=50',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        
        if response.status_code == 401:
            return JsonResponse({'error': 'Spotify session expired. Please reconnect.'}, status=401)
        
        if response.status_code != 200:
            return JsonResponse({
                'error': f'Spotify API error: {response.status_code}'
            }, status=response.status_code)
        
        return JsonResponse(response.json())
        
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': 'Failed to connect to Spotify', 'detail': str(e)}, status=503)

@csrf_exempt
def disconnect_spotify(request):
    """Disconnect Spotify from the user's account"""
    from rest_framework.authtoken.models import Token
    
    # Get user from Token auth header
    user = None
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Token '):
        token_key = auth_header.split(' ')[1]
        try:
            token_obj = Token.objects.get(key=token_key)
            user = token_obj.user
        except Token.DoesNotExist:
            return JsonResponse({'error': 'Invalid authentication token'}, status=401)
    elif hasattr(request, 'user') and request.user.is_authenticated:
        user = request.user
    else:
        return JsonResponse({'error': 'Not authenticated'}, status=401)
    
    # Clear Spotify credentials
    user.spotify_id = None
    user.spotify_display_name = None
    user.spotify_access_token = None
    user.spotify_refresh_token = None
    user.spotify_token_expires = None
    user.save()
    
    # Clear session tokens if they exist
    if 'spotify_access_token' in request.session:
        del request.session['spotify_access_token']
    if 'spotify_refresh_token' in request.session:
        del request.session['spotify_refresh_token']
    
    return JsonResponse({
        'success': True,
        'message': 'Spotify has been disconnected from your account'
    })


@csrf_exempt
def like_song(request):
    """Like/unlike a song"""
    from rest_framework.authtoken.models import Token
    from music.models import LikedSong
    import json
    
    # Get user from Token auth header
    user = None
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Token '):
        token_key = auth_header.split(' ')[1]
        try:
            token_obj = Token.objects.get(key=token_key)
            user = token_obj.user
        except Token.DoesNotExist:
            return JsonResponse({'error': 'Invalid authentication token'}, status=401)
    elif hasattr(request, 'user') and request.user.is_authenticated:
        user = request.user
    else:
        return JsonResponse({'error': 'Not authenticated'}, status=401)
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            spotify_track_id = data.get('spotify_track_id')
            track_name = data.get('track_name')
            artist_name = data.get('artist_name')
            album_name = data.get('album_name', '')
            album_image_url = data.get('album_image_url', '')
            
            if not all([spotify_track_id, track_name, artist_name]):
                return JsonResponse({'error': 'Missing required fields'}, status=400)
            
            # Check if already liked
            liked_song, created = LikedSong.objects.get_or_create(
                user=user,
                spotify_track_id=spotify_track_id,
                defaults={
                    'track_name': track_name,
                    'artist_name': artist_name,
                    'album_name': album_name,
                    'album_image_url': album_image_url
                }
            )
            
            return JsonResponse({
                'success': True,
                'liked': created,
                'message': 'Song liked' if created else 'Song already liked'
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    
    elif request.method == 'DELETE':
        try:
            data = json.loads(request.body)
            spotify_track_id = data.get('spotify_track_id')
            
            if not spotify_track_id:
                return JsonResponse({'error': 'Missing spotify_track_id'}, status=400)
            
            deleted_count, _ = LikedSong.objects.filter(
                user=user,
                spotify_track_id=spotify_track_id
            ).delete()
            
            return JsonResponse({
                'success': True,
                'unliked': deleted_count > 0,
                'message': 'Song unliked' if deleted_count > 0 else 'Song was not liked'
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def like_playlist(request):
    """Like/unlike a playlist"""
    from rest_framework.authtoken.models import Token
    from music.models import SavedPlaylist
    import json
    
    # Get user from Token auth header
    user = None
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Token '):
        token_key = auth_header.split(' ')[1]
        try:
            token_obj = Token.objects.get(key=token_key)
            user = token_obj.user
        except Token.DoesNotExist:
            return JsonResponse({'error': 'Invalid authentication token'}, status=401)
    elif hasattr(request, 'user') and request.user.is_authenticated:
        user = request.user
    else:
        return JsonResponse({'error': 'Not authenticated'}, status=401)
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            spotify_playlist_id = data.get('spotify_playlist_id')
            playlist_name = data.get('playlist_name')
            playlist_image_url = data.get('playlist_image_url', '')
            
            if not all([spotify_playlist_id, playlist_name]):
                return JsonResponse({'error': 'Missing required fields'}, status=400)
            
            # Check if already saved
            saved_playlist, created = SavedPlaylist.objects.get_or_create(
                user=user,
                spotify_playlist_id=spotify_playlist_id,
                defaults={
                    'playlist_name': playlist_name,
                    'playlist_image_url': playlist_image_url
                }
            )
            
            return JsonResponse({
                'success': True,
                'liked': created,
                'message': 'Playlist saved' if created else 'Playlist already saved'
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    
    elif request.method == 'DELETE':
        try:
            data = json.loads(request.body)
            spotify_playlist_id = data.get('spotify_playlist_id')
            
            if not spotify_playlist_id:
                return JsonResponse({'error': 'Missing spotify_playlist_id'}, status=400)
            
            deleted_count, _ = SavedPlaylist.objects.filter(
                user=user,
                spotify_playlist_id=spotify_playlist_id
            ).delete()
            
            return JsonResponse({
                'success': True,
                'unliked': deleted_count > 0,
                'message': 'Playlist removed' if deleted_count > 0 else 'Playlist was not saved'
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def get_music_library(request):
    """Get user's music library (liked songs and playlists)"""
    from rest_framework.authtoken.models import Token
    from music.models import LikedSong, SavedPlaylist
    
    # Get user from Token auth header
    user = None
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Token '):
        token_key = auth_header.split(' ')[1]
        try:
            token_obj = Token.objects.get(key=token_key)
            user = token_obj.user
        except Token.DoesNotExist:
            return JsonResponse({'error': 'Invalid authentication token'}, status=401)
    elif hasattr(request, 'user') and request.user.is_authenticated:
        user = request.user
    else:
        return JsonResponse({'error': 'Not authenticated'}, status=401)
    
    try:
        # Get liked songs
        liked_songs = LikedSong.objects.filter(user=user).values(
            'id', 'spotify_track_id', 'track_name', 'artist_name', 'album_name', 'album_image_url', 'liked_at'
        )
        
        # Get saved playlists
        saved_playlists = SavedPlaylist.objects.filter(user=user).values(
            'id', 'spotify_playlist_id', 'playlist_name', 'playlist_image_url', 'saved_at'
        )
        
        return JsonResponse({
            'success': True,
            'library': {
                'liked_songs': list(liked_songs),
                'saved_playlists': list(saved_playlists)
            }
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def check_liked_status(request):
    """Check if songs/playlists are liked by the user"""
    from rest_framework.authtoken.models import Token
    from music.models import LikedSong, SavedPlaylist
    import json
    
    # Get user from Token auth header
    user = None
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Token '):
        token_key = auth_header.split(' ')[1]
        try:
            token_obj = Token.objects.get(key=token_key)
            user = token_obj.user
        except Token.DoesNotExist:
            return JsonResponse({'error': 'Invalid authentication token'}, status=401)
    elif hasattr(request, 'user') and request.user.is_authenticated:
        user = request.user
    else:
        return JsonResponse({'error': 'Not authenticated'}, status=401)
    
    track_ids = request.GET.get('track_ids', '').split(',')
    track_ids = [tid.strip() for tid in track_ids if tid.strip()]
    
    playlist_ids = request.GET.get('playlist_ids', '').split(',')
    playlist_ids = [pid.strip() for pid in playlist_ids if pid.strip()]
    
    liked_tracks = set(
        LikedSong.objects.filter(
            user=user,
            spotify_track_id__in=track_ids
        ).values_list('spotify_track_id', flat=True)
    )
    
    saved_playlists = set(
        SavedPlaylist.objects.filter(
            user=user,
            spotify_playlist_id__in=playlist_ids
        ).values_list('spotify_playlist_id', flat=True)
    )
    
    return JsonResponse({
        'success': True,
        'liked_tracks': list(liked_tracks),
        'saved_playlists': list(saved_playlists)
    })

