from django.db import models
from django.contrib.auth import get_user_model
from cloudinary.models import CloudinaryField

UserModel = get_user_model()

class ParkingLocation(models.Model):
    user = models.ForeignKey(UserModel,on_delete=models.CASCADE)
    parking_paper = CloudinaryField('document', blank=True, null=True)
    is_paperverified = models.BooleanField(default=False)
    address = models.CharField(max_length=255)
    fee = models.DecimalField(max_digits=5,decimal_places=2,default=80.0)
    total_spot = models.IntegerField()
    used_spot = models.IntegerField(default=0)
    lat = models.DecimalField(max_digits=17,decimal_places=15)
    lon = models.DecimalField(max_digits=17,decimal_places=15)

class Reservation(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    parking = models.ForeignKey(ParkingLocation, on_delete=models.CASCADE)
    reservation = models.BooleanField(default=False)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True)
    total_amount = models.DecimalField(max_digits=8,decimal_places=2,null=True)

# class Payment(models.Model):
#     user = models.ForeignKey(UserModel, on_delete=models.CASCADE)