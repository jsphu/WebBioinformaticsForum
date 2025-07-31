from django.contrib import admin
from .models import Test1

# Register your models here.

class Test1Admin(admin.ModelAdmin):
    list_display = ("first_thing", "last_thing",)

admin.site.register(Test1, Test1Admin)
