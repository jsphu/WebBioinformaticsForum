from django.db import models

# Create your models here.
class Test1(models.Model):
    first_thing = models.CharField(max_length=15)
    last_thing = models.CharField(max_length=30)


    def __str__(self):
        return f"{self.first_thing} {self.last_thing}"
