# accounts/views.py - CORRECTED VERSION
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, logout
from django.views.decorators.csrf import csrf_exempt
from .models import CustomUser
import json

# SIGNUP - NO AUTHENTICATION REQUIRED
@api_view(['POST'])
@csrf_exempt
def signup_view(request):
    try:
        data = request.data
        
        # Validate required fields
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        
        if not all([username, email, password]):
            return Response({
                'success': False,
                'message': 'Username, email, and password are required'
            }, status=400)
        
        # Check if user exists
        if CustomUser.objects.filter(email=email).exists():
            return Response({
                'success': False,
                'message': 'User with this email already exists'
            }, status=400)
        
        if CustomUser.objects.filter(username=username).exists():
            return Response({
                'success': False,
                'message': 'Username already taken'
            }, status=400)
        
        # Create user
        user = CustomUser.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        
        # Create token for immediate login
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'success': True,
            'message': 'Account created successfully! Welcome to Tunr!',
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            }
        }, status=201)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': f'An error occurred: {str(e)}'
        }, status=500)

# LOGIN - NO AUTHENTICATION REQUIRED
@api_view(['POST'])
@csrf_exempt
def login_view(request):
    try:
        data = request.data
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()

        if not username or not password:
            return Response({
                'success': False,
                'message': 'Username and password are required'
            }, status=400)

        user = authenticate(username=username, password=password)
        
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'success': True,
                'message': f'Welcome back, {user.username}!',
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                }
            })
        else:
            return Response({
                'success': False,
                'message': 'Invalid username or password'
            }, status=401)
            
    except Exception as e:
        return Response({
            'success': False,
            'message': f'An error occurred: {str(e)}'
        }, status=500)

# LOGOUT - REQUIRES AUTHENTICATION
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        # Delete the user's token
        request.user.auth_token.delete()
        
        return Response({
            'success': True,
            'message': 'Logged out successfully'
        })
    except Exception as e:
        return Response({
            'success': False,
            'message': f'An error occurred during logout: {str(e)}'
        }, status=500)
