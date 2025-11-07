from django.db import models
from accounts.models import CustomUser


class LikedSong(models.Model):
    """Store user's liked songs from Spotify"""
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='liked_songs')
    spotify_track_id = models.CharField(max_length=100)
    track_name = models.CharField(max_length=255)
    artist_name = models.CharField(max_length=255)
    album_name = models.CharField(max_length=255, blank=True)
    album_image_url = models.URLField(blank=True, null=True)
    liked_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'spotify_track_id']
        ordering = ['-liked_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.track_name} by {self.artist_name}"


class SavedPlaylist(models.Model):
    """Store user's saved playlists from Spotify"""
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='saved_playlists')
    spotify_playlist_id = models.CharField(max_length=100)
    playlist_name = models.CharField(max_length=255)
    playlist_image_url = models.URLField(blank=True, null=True)
    saved_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'spotify_playlist_id']
        ordering = ['-saved_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.playlist_name}"


class RecentlyPlayed(models.Model):
    """Store user's recently played tracks from Spotify"""
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='recently_played')
    spotify_track_id = models.CharField(max_length=100)
    track_name = models.CharField(max_length=255)
    artist_name = models.CharField(max_length=255)
    album_name = models.CharField(max_length=255, blank=True)
    album_image_url = models.URLField(blank=True)
    played_at = models.DateTimeField()
    
    class Meta:
        ordering = ['-played_at']
        indexes = [
            models.Index(fields=['user', '-played_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.track_name} by {self.artist_name}"


