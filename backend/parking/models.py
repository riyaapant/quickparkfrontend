from django.db import models
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class parking_location(models.Model):
    user = models.ForeignKey(UserModel,on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    fee = models.DecimalField(max_digits=5,decimal_places=2,default=80.0)
    total_spot = models.IntegerField()
    used_spot = models.IntegerField(default=0)
    lat = model.DecimalField(max_digits=8,decimal_places=6)
    lon = model.DecimalField(max_digits=8,decimal_places=6)

class reservation(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    parking = models.ForeignKey(parking_location, on_delete=model.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True)
    total_amount = models.DecimalField(max_digits=8,decimal_places=2,null=True)
    