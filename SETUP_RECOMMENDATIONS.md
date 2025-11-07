# Setup Instructions for Trending Recommendations Feature

## Changes Made

### 1. Backend - New Music Model
Added `RecentlyPlayed` model to track songs friends are listening to:
- Location: `backend/music/models.py`
- Tracks: spotify_track_id, track_name, artist_name, album_image_url, played_at

### 2. Backend - Music Recommendations API
Updated `/api/accounts/recommendations/music/` endpoint:
- Shows songs friends recently played (last 7 days)
- Shows songs friends liked
- Sorted by popularity (how many friends listened/liked)
- Location: `backend/accounts/views_social.py`

### 3. Frontend - Personalized Feed Page
Completely redesigned to show:
- **Trending Movies**: Movies friends rated 4-5 stars
- **Trending Music**: Songs friends are listening to and liking
- Beautiful grid layouts with posters/album art
- Friend attribution ("@username liked this", "3 friends listened")

## Steps to Complete Setup

### 1. Activate Virtual Environment & Create Migration
```powershell
cd backend
.\envutunr\Scripts\Activate.ps1
python manage.py makemigrations music
python manage.py migrate
```

### 2. Start Backend Server
```powershell
# (Keep virtual environment activated)
python manage.py runserver
```

### 3. For Spotify to Keep Users Logged In
The Spotify tokens are already being stored in the database:
- `spotify_access_token` - stored in CustomUser model
- `spotify_refresh_token` - stored in CustomUser model  
- `spotify_token_expires_at` - stored in CustomUser model

The system automatically refreshes expired tokens, so users stay logged in!

### 4. To Track Recently Played Songs
You need to periodically fetch and save recently played tracks. Add this to your Spotify callback or create a scheduled task:

```python
# In music/views.py - add after successful Spotify login
from music.models import RecentlyPlayed
from django.utils.dateparse import parse_datetime

def save_recently_played(user, access_token):
    """Fetch and save user's recently played tracks"""
    response = requests.get(
        'https://api.spotify.com/v1/me/player/recently-played?limit=50',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    
    if response.status_code == 200:
        data = response.json()
        for item in data.get('items', []):
            track = item['track']
            played_at = parse_datetime(item['played_at'])
            
            RecentlyPlayed.objects.get_or_create(
                user=user,
                spotify_track_id=track['id'],
                played_at=played_at,
                defaults={
                    'track_name': track['name'],
                    'artist_name': ', '.join([artist['name'] for artist in track['artists']]),
                    'album_name': track['album']['name'],
                    'album_image_url': track['album']['images'][0]['url'] if track['album']['images'] else '',
                }
            )
```

## How It Works

### Movies
1. User rates movies (4-5 stars)
2. System tracks these in `MovieReview` model
3. Friends see these movies in their "For You" page
4. Shows: poster, title, year, IMDb rating, "@username rated it 5★"

### Music
1. User connects Spotify (once - stays logged in)
2. System periodically fetches recently played tracks
3. Saves to `RecentlyPlayed` model
4. Friends see trending songs based on:
   - How many friends listened (🔥 "3 friends listened")
   - Songs friends liked (❤️ "@username liked this")
5. Shows: album art, track name, artist, reason

## Testing

1. **Create test users** and have them follow each other
2. **Rate movies** (4-5 stars) with user A
3. **Check recommendations** for user B - should see user A's movies
4. **Connect Spotify** with user A
5. **Listen to music** on Spotify
6. **Manually save tracks** (call save_recently_played function)
7. **Check recommendations** for user B - should see user A's music

## URLs Added

- `/api/accounts/recommendations/movies/` - Friend movie recommendations
- `/api/accounts/recommendations/music/` - Friend music recommendations
- `/api/accounts/activity/` - User activity feed
- `/api/accounts/activity/<username>/` - Specific user activity

## Next Steps

1. Run migrations
2. Start server
3. Test movie recommendations (should work now)
4. Add periodic task to fetch recently played songs
5. Test music recommendations

Enjoy your trending recommendations feature! 🎬🎵
