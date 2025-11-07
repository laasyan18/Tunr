from django.db import models
from accounts.models import CustomUser

# Movie data from OMDb
class Movie(models.Model):
    """Store movie data from OMDb"""
    imdb_id = models.CharField(max_length=20, unique=True, primary_key=True)
    title = models.CharField(max_length=255)
    year = models.CharField(max_length=10, blank=True)
    genre = models.CharField(max_length=255, blank=True)  # e.g., "Action, Thriller"
    director = models.CharField(max_length=255, blank=True)
    actors = models.TextField(blank=True)
    plot = models.TextField(blank=True)
    poster = models.URLField(blank=True)
    imdb_rating = models.CharField(max_length=10, blank=True)
    runtime = models.CharField(max_length=20, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} ({self.year})"
    
    class Meta:
        ordering = ['-created_at']


class UserMovieInteraction(models.Model):
    """Track user interactions with movies"""
    INTERACTION_TYPES = [
        ('watched', 'Watched'),
        ('want_to_watch', 'Want to Watch'),
        ('like', 'Like'),
        ('love', 'Love'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='movie_interactions')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='user_interactions')
    interaction_type = models.CharField(max_length=20, choices=INTERACTION_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'movie', 'interaction_type']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.interaction_type} - {self.movie.title}"


class UserGenrePreference(models.Model):
    """Track user's favorite genres"""
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='genre_preferences')
    genre = models.CharField(max_length=50)  # e.g., "Action", "Drama"
    preference_score = models.IntegerField(default=1)  # Higher = more preferred
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'genre']
        ordering = ['-preference_score']
    
    def __str__(self):
        return f"{self.user.username} - {self.genre} ({self.preference_score})"


class MovieReview(models.Model):
    """User reviews and ratings for movies (only for watched movies)"""
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='movie_reviews')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField()  # 1-5 stars (required for watched movies)
    review_text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'movie']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.movie.title} ({self.rating}⭐)"
    
    def save(self, *args, **kwargs):
        # Auto-mark as watched when review is created
        UserMovieInteraction.objects.get_or_create(
            user=self.user,
            movie=self.movie,
            interaction_type='watched'
        )
        super().save(*args, **kwargs)


