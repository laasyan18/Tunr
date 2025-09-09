
# Create your views here.
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
import json
from .models import CustomUser

@csrf_exempt
@require_http_methods(["POST"])
def signup_view(request):
    try:
        data = json.loads(request.body)
        
        # Validate required fields
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if field not in data or not data[field].strip():
                return JsonResponse({
                    'success': False,
                    'message': f'{field.capitalize()} is required'
                }, status=400)
        
        # Validate email format
        try:
            validate_email(data['email'])
        except ValidationError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid email format'
            }, status=400)
        
        # Check if user already exists
        if CustomUser.objects.filter(email=data['email']).exists():
            return JsonResponse({
                'success': False,
                'message': 'User with this email already exists'
            }, status=400)
        
        if CustomUser.objects.filter(username=data['username']).exists():
            return JsonResponse({
                'success': False,
                'message': 'Username already taken'
            }, status=400)
        
        # Create user
        user = CustomUser.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )
        
        # Log in the user immediately
        login(request, user)
        
        return JsonResponse({
            'success': True,
            'message': 'Account created successfully! Welcome to Tunr!',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'bio': user.bio,
                'created_at': user.created_at.isoformat()
            }
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON format'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'An error occurred: {str(e)}'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    try:
        data = json.loads(request.body)
        
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        if not email or not password:
            return JsonResponse({
                'success': False,
                'message': 'Email and password are required'
            }, status=400)
        
        try:
            user_obj = CustomUser.objects.get(email=email)
            user = authenticate(request, username=user_obj.username, password=password)
        except CustomUser.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Invalid email or password'
            }, status=401)
        
        if user is not None:
            login(request, user)
            return JsonResponse({
                'success': True,
                'message': f'Welcome back to Tunr, {user.username}!',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'bio': user.bio,
                    'favorite_genres': user.favorite_genres,
                    'music_mood_tags': user.music_mood_tags
                }
            })
        else:
            return JsonResponse({
                'success': False,
                'message': 'Invalid email or password'
            }, status=401)
            
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'An error occurred: {str(e)}'
        }, status=500)

@csrf_exempt 
@require_http_methods(["POST", "GET"])
def logout_view(request):
    if request.user.is_authenticated:
        username = request.user.username
        logout(request)
        return JsonResponse({
            'success': True,
            'message': f'Goodbye {username}! Thanks for using Tunr!'
        })
    else:
        return JsonResponse({
            'success': False,
            'message': 'No user is currently logged in'
        }, status=400)

@login_required
def profile_view(request):
    return JsonResponse({
        'success': True,
        'user': {
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'bio': request.user.bio,
            'favorite_genres': request.user.favorite_genres,
            'music_mood_tags': request.user.music_mood_tags,
            'profile_picture': request.user.profile_picture.url if request.user.profile_picture else None,
            'created_at': request.user.created_at.isoformat(),
            'updated_at': request.user.updated_at.isoformat()
        }
    })

def check_auth_status(request):
    if request.user.is_authenticated:
        return JsonResponse({
            'authenticated': True,
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email
            }
        })
    else:
        return JsonResponse({'authenticated': False})
