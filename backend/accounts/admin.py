from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    
    # Remove created_at and updated_at from these lists
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_staff', 'spotify_display_name']
    list_filter = ['is_staff', 'is_superuser', 'is_active']
    readonly_fields = []  # Remove created_at, updated_at
    
    # Add your custom fields to the form
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('bio', 'preferred_languages', 'profile_picture')
        }),
        ('Spotify Integration', {
            'fields': ('spotify_id', 'spotify_display_name', 'spotify_token_expires'),
            'classes': ('collapse',),
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional Info', {
            'fields': ('email', 'bio', 'preferred_languages')
        }),
    )

admin.site.register(CustomUser, CustomUserAdmin)
