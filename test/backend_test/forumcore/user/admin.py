from django.contrib import admin
from .models import UserClass

# Register your models here.

class UserClassAdmin(admin.ModelAdmin):
    list_display = ("username", "created",)

admin.site.register(UserClass, UserClassAdmin)
