# backend/music/views.py
import requests
from django.shortcuts import redirect
from django.http import JsonResponse, HttpResponse
from django.conf import settings
import urllib.parse
from rest_framework.authtoken.models import Token
from django.utils import timezone
from datetime import timedelta
from accounts.models import CustomUser

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

def spotify_search(request):
    """Search Spotify API"""
    query = request.GET.get('q')
    access_token = request.session.get('spotify_access_token')
    # fall back to stored token on user model if available
    if not access_token and hasattr(request, 'user') and request.user.is_authenticated:
        access_token = getattr(request.user, 'spotify_access_token', None)

    if not access_token:
        return JsonResponse({'error': 'Not authenticated'}, status=401)
    
    # Request 50 tracks to increase chances of finding tracks with previews
    response = requests.get(
        f'https://api.spotify.com/v1/search?q={query}&type=track&limit=50&market=US',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    
    return JsonResponse(response.json())

def get_user_profile(request):
    """Get current user's Spotify profile"""
    access_token = request.session.get('spotify_access_token')
    if not access_token and hasattr(request, 'user') and request.user.is_authenticated:
        access_token = getattr(request.user, 'spotify_access_token', None)

    if not access_token:
        return JsonResponse({'error': 'Not authenticated'}, status=401)

    response = requests.get(
        'https://api.spotify.com/v1/me',
        headers={'Authorization': f'Bearer {access_token}'}
    )

    return JsonResponse(response.json())

def get_user_playlists(request):
    """Get current user's playlists"""
    access_token = request.session.get('spotify_access_token')
    if not access_token and hasattr(request, 'user') and request.user.is_authenticated:
        access_token = getattr(request.user, 'spotify_access_token', None)

    if not access_token:
        return JsonResponse({'error': 'Not authenticated'}, status=401)

    response = requests.get(
        'https://api.spotify.com/v1/me/playlists?limit=50',
        headers={'Authorization': f'Bearer {access_token}'}
    )

    return JsonResponse(response.json())

def get_top_tracks(request):
    """Get user's top tracks"""
    access_token = request.session.get('spotify_access_token')
    if not access_token and hasattr(request, 'user') and request.user.is_authenticated:
        access_token = getattr(request.user, 'spotify_access_token', None)

    if not access_token:
        return JsonResponse({'error': 'Not authenticated'}, status=401)

    response = requests.get(
        'https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=short_term',
        headers={'Authorization': f'Bearer {access_token}'}
    )

    return JsonResponse(response.json())

def get_recently_played(request):
    """Get user's recently played tracks"""
    access_token = request.session.get('spotify_access_token')
    if not access_token and hasattr(request, 'user') and request.user.is_authenticated:
        access_token = getattr(request.user, 'spotify_access_token', None)

    if not access_token:
        return JsonResponse({'error': 'Not authenticated'}, status=401)

    response = requests.get(
        'https://api.spotify.com/v1/me/player/recently-played?limit=50',
        headers={'Authorization': f'Bearer {access_token}'}
    )

    return JsonResponse(response.json())

def get_following(request):
    """Get artists user is following"""
    access_token = request.session.get('spotify_access_token')
    if not access_token and hasattr(request, 'user') and request.user.is_authenticated:
        access_token = getattr(request.user, 'spotify_access_token', None)

    if not access_token:
        return JsonResponse({'error': 'Not authenticated'}, status=401)

    response = requests.get(
        'https://api.spotify.com/v1/me/following?type=artist&limit=50',
        headers={'Authorization': f'Bearer {access_token}'}
    )

    return JsonResponse(response.json())
