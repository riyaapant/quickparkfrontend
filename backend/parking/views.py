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

class ViewParkingLocation(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        parking_locations = ParkingLocation.objects.all()
        parking_data=[]
        for parking in parking_locations:
            parking_data.append({
                'id'    :parking.id,
                'address':parking.address,
                'lat'   :parking.lat,
                'lon'   :parking.lon
            })
        return Response(parking_data,status=status.HTTP_200_OK)

class ViewParking(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,id):
        parking = ParkingLocation.objects.get(pk=id)
        parking_info = {
            'id'    : parking.id,
            'user'  :parking.user,
            'address':Parking.address,
            'total' : parking.total_spot,
            'used'  : parking.used_spot,
            'fee'   :parking.fee,
            'lat'   : parking.lat,
            'lon'   : parking.lon
        }
        return Response(parking_info, status=status.HTTP_200_OK)

class ViewReservation(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        reservations = Reservation.objects.all(user = user)
        reservation_data = []
        for reservation in reservations:
            reservation_data.append({
                'address'   : reservation.parking.address,
                'start_time': reservation.start_time,
                'end_time'  : reservation.end_time,
                'amount'    : reservation.amount
            })
            return Response(reservation_data, status = status.HTTP_200_OK)

