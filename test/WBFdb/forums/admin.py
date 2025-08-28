from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from forums.user.models import WBFUserModel
from forums.announce.models import AnnounceModel
from forums.opine.models import OpineModel
from forums.report.models import ReportModel

@admin.register(ReportModel)
class ReportAdmin(admin.ModelAdmin):
    list_display = (
        'public_id', 'reported_by', 'reason',
        'report_tag', 'report_type', 'report_title',
        'is_resolved', 'resolved_at'
    )
    list_filter = (
        'report_title', 'report_tag', 'report_type', 'is_resolved'
    )
    search_fields = ('reported_by__username', 'report_tag', 'report_title')
    fieldsets = (
        (
            None,
            {'fields': (
                'reported_by', 'reason', 'content_type', 'object_id',
                'report_tag', 'report_type', 'report_title',
                'is_resolved', 'resolved_at'
                )
            }
        ),
    )

@admin.register(OpineModel)
class OpineAdmin(admin.ModelAdmin):
    list_display = (
        'public_id', 'author', 'content',
        'created_at', 'updated_at'
    )
    list_filter = (
        'author', 'created_at'
    )
    search_fields = ('author__username', 'content')
    ordering = ('-created_at',)
    fieldsets = (
        (
            None,
            {'fields': (
                    'author', 'content',
                )
            }
        ),
    )

@admin.register(AnnounceModel)
class AnnounceAdmin(admin.ModelAdmin):
    list_display = (
        'public_id', 'author', 'content',
        'created_at', 'updated_at'
    )
    list_filter = (
        'author', 'created_at'
    )
    search_fields = ('author__username', 'content')
    ordering = ('-created_at',)
    fieldsets = (
        (
            None,
            {'fields': (
                    'author', 'content',
                )
            }
        ),
    )

@admin.register(WBFUserModel)
class WBFUserAdmin(UserAdmin):
    list_display = (
        'email', 'username', 'is_staff',
        'is_active', 'is_moderator'
    )
    list_filter = (
        'is_staff', 'is_moderator',
        'is_active',
    )
    search_fields = ('username', 'email')
    ordering = ('username',)

    fieldsets = (
        (None, {
            'fields': ('username', 'password')
        }),
        ('Personal info', {
            'fields': ('first_name', 'last_name', 'email', 'bio',
                      'orcid', 'university', 'department')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser',
                      'is_moderator', 'groups', 'user_permissions'),
        }),
        ('Social', {
            'fields': ('website', 'twitter_profile', 'github_profile', 'linkedin_profile'),
            'classes': ('collapse',)
        }),
    )

    # For adding new users
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )
