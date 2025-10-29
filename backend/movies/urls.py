# movies/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('search/', views.search_movies, name='search_movies'),
    path('details/<str:imdb_id>/', views.get_movie_details, name='movie_details'),
]
