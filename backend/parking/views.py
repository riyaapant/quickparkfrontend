from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .serializers import ParkingSerializer
from .models import ParkingLocation,Reservation

UserModel = get_user_model()

class AddParking(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        serializer = ParkingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response('Parkign added Successfully', status=status.HTTP_200_OK)
        return Response('Parking data serialization failed', status = status.HTTP_400_BAD_REQUEST)


