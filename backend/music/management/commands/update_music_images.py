from django.core.management.base import BaseCommand
from music.models import LikedSong, SavedPlaylist
import requests
from django.conf import settings


class Command(BaseCommand):
    help = 'Update album images for existing liked songs and playlists'

    def handle(self, *args, **options):
        # Get songs without images
        songs_without_images = LikedSong.objects.filter(album_image_url__isnull=True) | LikedSong.objects.filter(album_image_url='')
        playlists_without_images = SavedPlaylist.objects.filter(playlist_image_url__isnull=True) | SavedPlaylist.objects.filter(playlist_image_url='')
        
        self.stdout.write(f"Found {songs_without_images.count()} songs without images")
        self.stdout.write(f"Found {playlists_without_images.count()} playlists without images")
        
        # Get a Spotify access token from any user who has one
        from accounts.models import CustomUser
        spotify_user = CustomUser.objects.exclude(spotify_access_token__isnull=True).exclude(spotify_access_token='').first()
        
        if not spotify_user:
            self.stdout.write(self.style.ERROR("No user with Spotify token found. Please connect to Spotify first."))
            return
        
        access_token = spotify_user.spotify_access_token
        headers = {'Authorization': f'Bearer {access_token}'}
        
        # Update songs
        updated_songs = 0
        for song in songs_without_images:
            try:
                # Fetch track details from Spotify
                response = requests.get(
                    f'https://api.spotify.com/v1/tracks/{song.spotify_track_id}',
                    headers=headers
                )
                
                if response.status_code == 200:
                    track_data = response.json()
                    if track_data.get('album', {}).get('images'):
                        song.album_image_url = track_data['album']['images'][0]['url']
                        song.save()
                        updated_songs += 1
                        self.stdout.write(f"Updated: {song.track_name}")
                elif response.status_code == 401:
                    self.stdout.write(self.style.ERROR("Spotify token expired. Please reconnect to Spotify."))
                    break
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"Failed to update {song.track_name}: {str(e)}"))
        
        # Update playlists
        updated_playlists = 0
        for playlist in playlists_without_images:
            try:
                # Fetch playlist details from Spotify
                response = requests.get(
                    f'https://api.spotify.com/v1/playlists/{playlist.spotify_playlist_id}',
                    headers=headers
                )
                
                if response.status_code == 200:
                    playlist_data = response.json()
                    if playlist_data.get('images'):
                        playlist.playlist_image_url = playlist_data['images'][0]['url']
                        playlist.save()
                        updated_playlists += 1
                        self.stdout.write(f"Updated: {playlist.playlist_name}")
                elif response.status_code == 401:
                    self.stdout.write(self.style.ERROR("Spotify token expired. Please reconnect to Spotify."))
                    break
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"Failed to update {playlist.playlist_name}: {str(e)}"))
        
        self.stdout.write(self.style.SUCCESS(f"Successfully updated {updated_songs} songs and {updated_playlists} playlists!"))
