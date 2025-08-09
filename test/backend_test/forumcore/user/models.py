from django.db import models

# Create your models here.
class UserClass(models.Model):
    username = models.CharField(max_length=50)
    email = models.EmailField()
    first_name = models.CharField(null=True, blank=True)
    last_name = models.CharField(null=True, blank=True)
    avatar = models.ImageField(null=True)
    bio = models.TextField(null=True, blank=True)
    orcid = models.CharField(null=True, blank=True)
    university = models.CharField(null=True, blank=True)
    created = models.DateTimeField()

    def __str__(self):
        return f"{self.username}||{self.first_name} {self.last_name}"
