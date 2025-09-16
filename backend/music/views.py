# backend/music/views.py
import requests
from django.shortcuts import redirect
from django.http import JsonResponse, HttpResponse
from django.conf import settings
import urllib.parse

def spotify_login(request):
    """Start Spotify OAuth - redirect user to Spotify"""
    client_id = settings.SPOTIFY_CLIENT_ID
    redirect_uri = 'http://127.0.0.1:8000/callback'
    scopes = 'user-read-private playlist-read-private user-read-email'
    
    auth_url = (
        f"https://accounts.spotify.com/authorize?"
        f"client_id={client_id}&"
        f"response_type=code&"
        f"redirect_uri={urllib.parse.quote(redirect_uri)}&"
        f"scope={urllib.parse.quote(scopes)}"
    )
    
    return redirect(auth_url)

def spotify_callback(request):
    """Handle callback from Spotify with authorization code"""
    code = request.GET.get('code')
    error = request.GET.get('error')
    
    if error:
        return redirect(f'http://127.0.0.1:3000/login?error={error}')
    
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
            request.session['spotify_access_token'] = tokens['access_token']
            request.session['spotify_refresh_token'] = tokens.get('refresh_token')
            
            return redirect('http://127.0.0.1:3000/dashboard?auth=success')
        else:
            return redirect('http://127.0.0.1:3000/login?error=token_failed')
    
    return redirect('http://127.0.0.1:3000/login?error=no_code')

def spotify_search(request):
    """Search Spotify API"""
    query = request.GET.get('q')
    access_token = request.session.get('spotify_access_token')
    
    if not access_token:
        return JsonResponse({'error': 'Not authenticated'}, status=401)
    
    response = requests.get(
        f'https://api.spotify.com/v1/search?q={query}&type=track&limit=20',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    
    return JsonResponse(response.json())

def get_user_profile(request):
    """Get current user's Spotify profile"""
    access_token = request.session.get('spotify_access_token')
    
    if not access_token:
        return JsonResponse({'error': 'Not authenticated'}, status=401)
    
    response = requests.get(
        'https://api.spotify.com/v1/me',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    
    return JsonResponse(response.json())
