from django.contrib import admin
from .models import Movie, UserMovieInteraction, UserGenrePreference, MovieReview


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ['title', 'year', 'genre', 'imdb_rating', 'created_at']
    search_fields = ['title', 'director', 'actors']
    list_filter = ['year', 'created_at']


@admin.register(MovieReview)
class MovieReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'movie', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['user__username', 'movie__title', 'review_text']


@admin.register(UserMovieInteraction)
class UserMovieInteractionAdmin(admin.ModelAdmin):
    list_display = ['user', 'movie', 'interaction_type', 'created_at']
    list_filter = ['interaction_type', 'created_at']
    search_fields = ['user__username', 'movie__title']


@admin.register(UserGenrePreference)
class UserGenrePreferenceAdmin(admin.ModelAdmin):
    list_display = ['user', 'genre', 'preference_score', 'last_updated']
    list_filter = ['genre']
    search_fields = ['user__username', 'genre']

