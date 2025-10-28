from django.contrib.auth.models import AbstractUser
#from django.contrib.auth.models import User
from django.conf import settings
from django.utils import timezone
from django.db import models


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    bio = models.TextField(max_length=500, blank=True)
    preferred_languages = models.CharField(max_length=300, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    # Spotify integration fields
    spotify_id = models.CharField(max_length=128, blank=True, null=True)
    spotify_display_name = models.CharField(max_length=255, blank=True, null=True)
    spotify_access_token = models.TextField(blank=True, null=True)
    spotify_refresh_token = models.TextField(blank=True, null=True)
    spotify_token_expires = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)   # set once on create
    updated_at = models.DateTimeField(auto_now=True) 
    
    def __str__(self):
        return self.username
    
    def get_languages_list(self):
        if self.preferred_languages:
            return [lang.strip() for lang in self.preferred_languages.split(',')]
        return []


class UserEvent(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Changed this line
    item_id = models.CharField(max_length=64)
    item_type = models.CharField(max_length=16, choices=[('movie', 'Movie'), ('song', 'Song')])
    action = models.CharField(max_length=16, choices=[
        ('view', 'View'), ('like', 'Like'), ('review', 'Review'), 
        ('search', 'Search'), ('play', 'Play')
    ])
    ts = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_events'


class DailyAggregate(models.Model):
    date = models.DateField()
    metric = models.CharField(max_length=32)
    value = models.FloatField()
    dim_key = models.CharField(max_length=64, blank=True, null=True)
    
    class Meta:
        unique_together = ('date', 'metric', 'dim_key')
        db_table = 'daily_aggregates'


class ModerationQueue(models.Model):
    entity_id = models.CharField(max_length=64)
    entity_type = models.CharField(max_length=16)
    reason = models.CharField(max_length=128)
    status = models.CharField(max_length=16, choices=[
        ('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')
    ], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)  # Changed this line

    class Meta:
        db_table = 'moderation_queue'
