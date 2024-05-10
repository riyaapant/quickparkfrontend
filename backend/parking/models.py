from django.db import models
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class parking_location(models.Model):
    user = models.ForeignKey(UserModel,on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    fee = models.DecimalField(max_digits=5,decimal_places=2,default=80.0)
    total_spot = models.IntegerField()
