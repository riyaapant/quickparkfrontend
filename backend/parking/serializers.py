from rest_framework import serializers
from .models import ParkingLocation

class ParkingSerializer(serializers.ModelSerializer):
    class Meta:
        model = 'ParkingLocation'
        field ='__all__'