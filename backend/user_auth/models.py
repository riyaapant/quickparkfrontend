# from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.db import models

class UserModelManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_admin(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

    # def create_owner(self, email, password=None, **extra_fields):
    #     extra_fields.setdefault('is_owner', True)
    #     return self.create_user(email, password, **extra_fields)

class UserModel(AbstractBaseUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=10)
    password = models.CharField(max_length=254)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    contact = models.CharField(max_length=10,null=True)
    address = models.CharField(max_length=100,null=True)
    balance = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)
    is_active = models.BooleanField(default=False)
    # is_owner = models.BooleanField(default=False)

    objects = UserModelManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['']

    def __str__(self):
        return self.first_name + ' ' + self.last_name

class Customer(models.Model):
    user = models.OneToOneField(UserModel, on_delete=models.CASCADE)
    vehicle_id = models.CharField(max_length=7,null=True)
    license_paper = models.BinaryField(null=True)
    reservation_id = models.IntegerField(null=True)
    # is_emailverified = models.BooleanField(default=False)
    is_paperverified = models.BooleanField(default=False)

class Owner(models.Model):
    user =models.OneToOneField(UserModel, on_delete=models.CASCADE)
    home_paper = models.BinaryField(null=True)
    # is_emailverified = models.BooleanField(default=False)
    is_paperverified = models.BooleanField(default=False)

