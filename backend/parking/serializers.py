from rest_framework import serializers
from .models import ParkingLocation

class ParkingSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = ParkingLocation
        fields ='__all__'
    
    def get_user(self,obj):
        return self.context['request'].user


# {
# "address":"somewhere",
# "total_spot":"4",
# "lat":"27.682593",
# "lon":"85.331168"
# }