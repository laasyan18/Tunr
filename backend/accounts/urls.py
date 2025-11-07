# accounts/urls.py
from django.urls import path
from . import views
from . import views_social

urlpatterns = [
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    
    # Social features
    path('profile/', views_social.get_profile, name='profile'),
    path('profile/<str:username>/', views_social.get_profile, name='profile_user'),
    path('activity/', views_social.get_user_activity, name='user_activity'),
    path('activity/<str:username>/', views_social.get_user_activity, name='user_activity_for_user'),
    path('follow/<str:username>/', views_social.toggle_follow, name='toggle_follow'),
    path('friends/activity/', views_social.get_friends_activity, name='friends_activity'),
    path('users/search/', views_social.search_users, name='search_users'),
    path('recommendations/', views_social.get_friend_recommendations, name='friend_recommendations'),
    path('recommendations/movies/', views_social.get_friend_movie_recommendations, name='friend_movie_recommendations'),
    path('recommendations/music/', views_social.get_personalized_music_recommendations, name='music_recommendations'),
    path('following/', views_social.get_following, name='get_following'),
    path('following/<str:username>/', views_social.get_following, name='get_following_user'),
    path('followers/', views_social.get_followers, name='get_followers'),
    path('followers/<str:username>/', views_social.get_followers, name='get_followers_user'),
]

