

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    bio = models.TextField(max_length=500, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    favorite_genres = models.CharField(max_length=200, blank=True)
    music_mood_tags = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'  # Login with email
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return f"{self.username} ({self.email})"
    
    class Meta:
        verbose_name = 'Tunr User'
        verbose_name_plural = 'Tunr Users'
