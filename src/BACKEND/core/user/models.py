import uuid

from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, PermissionsMixin)
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from core.abstract.models import AbstractModel, AbstractManager

## USER MANAGER
class UserManager(BaseUserManager, AbstractManager):
    def get_object_by_public_id(self, public_id: str):
        try:
            instance = self.get(public_id=public_id)
            return instance
        except (ObjectDoesNotExist, ValueError, TypeError):
            return Http404

    def create_user(self,
                    username:str,
                    email:str,
                    password:str =None,
                    **kwargs):
        """Create an ordinary user"""
        if username is None: raise TypeError('Username is mandatory field')
        if email is None: raise TypeError('Email is mandatory field')
        if password is None: raise TypeError('Password is mandatory field')

        user = self.model(
            username=username,
            email=self.normalize_email(email),
            **kwargs
        )
        user.set_password(password)
        user.save(using=self._db)
        return user


    def create_superuser(self,
                         username:str,
                         email:str,
                         password:str,
                         **kwargs):
        """Create a priviliged superuser"""
        if password is None: raise TypeError("Password is mandatory field")
        if email is None: raise TypeError("Email is mandatory field")
        if username is None: raise TypeError("Username is mandatory field")

        user = self.create_user(
            username=username,
            email=email,
            password=password, **kwargs
        )
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user

# USER CLASS
class User(, AbstractModel, PermissionsMixin):

   # USER MANDATORY FIELDS
   username = models.CharField(
       db_index=True,
       max_length=30,
       unique=True
   )
   firstname = models.CharField(max_length=50)
   lastname = models.CharField(max_length=50)
   email = models.EmailField(db_index=True, unique=True)

   # USER OPTIONAL FIELDS
   bio = models.TextField(default="", blank=True)
   orcid = models.CharField(default="", blank=True)
   institute = models.CharField(default="", blank=True)

   """ *NOT IMPLEMENTED YET*
   avatar
   pipelines_owned
   modules_owned
   has_liked
   reports_issued
   posts_count
   """

   is_active = models.BooleanField(default=True)
   is_superuser = models.BooleanField(default=False)
   is_staff = models.BooleanField(default=False)

   USERNAME_FIELD = 'username'
   REQUIRED_FIELDS = ['username']

   objects = UserManager()

   def __str__(self):
       return f'{self.email}'

    @property
    def name(self):
        return f"{self.firstname} {self.lastname}"
