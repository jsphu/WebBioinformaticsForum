from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import WBFUserModel

@admin.register(WBFUserModel)
class WBFUserAdmin(UserAdmin):
    model = WBFUserModel
    list_display = (
        'email', 'username', 'is_staff',
        'is_active', 'is_moderator'
    )
    list_filter = (
        'is_staff',  'is_moderator',
        'is_active',
    )
    search_fields = ('username', 'email')
    ordering = ('username',)
    fieldsets = (
        (
            None,
            {'fields': (
                'username', 'email', 'joined_at', 'is_active',
                'is_moderator', 'is_staff', 'is_superuser',
                'groups', 'user_permissions',
                'orcid', 'first_name', 'last_name',
                'bio', 'university', 'department',
                )
            }
        ),
    )
