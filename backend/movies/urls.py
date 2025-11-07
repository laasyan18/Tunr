# movies/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('search/', views.search_movies, name='search_movies'),
    path('details/<str:imdb_id>/', views.get_movie_details, name='movie_details'),
    
    # Review endpoints
    path('reviews/create/', views.create_review, name='create_review'),
    path('reviews/movie/<str:imdb_id>/', views.get_movie_reviews, name='get_movie_reviews'),
    path('reviews/my-reviews/', views.get_user_reviews, name='get_user_reviews'),
    path('reviews/delete/<int:review_id>/', views.delete_review, name='delete_review'),
    
    # Library & interactions
    path('watch-state/', views.toggle_watch_state, name='toggle_watch_state'),
    path('toggle-like/', views.toggle_like, name='toggle_like'),
    path('library/', views.get_user_library, name='get_user_library'),
    path('stats/<str:imdb_id>/', views.get_movie_stats, name='get_movie_stats'),
]

