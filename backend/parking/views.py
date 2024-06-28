from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .serializers import ParkingSerializer
from .models import ParkingLocation,Reservation
from user_auth.serializers import UserSerializer

UserModel = get_user_model()

class AddParking(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        user = UserModel.objects.get(id=request.user.id)
        # serializer = ParkingSerializer(data=request.data, context={'request': request})
        # if serializer.is_valid():
        #     serializer.save(user=user)
        #     return Response("parking added successfully", status=status.HTTP_200_OK)
        # return Response("Parking Serializer Failed", status = status.HTTP_400_BAD_REQUEST)
        try:
            park_obj = ParkingLocation.objects.create(user=user,address=request.data['address'],total_spot=request.data['total_spot'],lat=request.data['lat'],lon=request.data['lon'],parking_paper=request.data['file'],fee=request.data['fee'])
            park_obj.save()
            return Response("Parking added Successfully", status=status.HTTP_200_OK)
        except:
            return Response('Parking creation failed', status=status.HTTP_400_BAD_REQUEST)

class UploadParkingFile(APIView):
    permission_classes = [IsAuthenticated]
    def put(self,request,id):
        parking = ParkingLocation.objects.get(id=id)
        parking.parking_paper = request.data['file']
        return Response("File Uploaded", status = status.HTTP_200_OK)

class ViewUnverifiedParkingLocations(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        parking_locations = ParkingLocation.objects.all()
        parking_data= []
        for parking in parking_locations:
            parking_data.append({
                'id'    :parking.id,
                'address':parking.address,
                'lat'   :parking.lat,
                'lon'   :parking.lon,
            })
        return Response(parking_data, status =status.HTTP_200_OK)

class ViewParkingLocations(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        parking_locations = ParkingLocation.objects.all()
        parking_data=[]
        for parking in parking_locations:
            if parking.is_paperverified:
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
            'user'  :f'{parking.user.first_name} {parking.user.last_name}',
            'address':parking.address,
            'total' : parking.total_spot,
            'used'  : parking.used_spot,
            'fee'   :parking.fee,
            'lat'   : parking.lat,
            'lon'   : parking.lon
        }
        return Response(parking_info, status=status.HTTP_200_OK)

class ViewOwnParking(APIView):
    def get(self,request):
        user = UserModel.objects.get(id=request.user.id)
        parking_locations = ParkingLocation.objects.filter(user=user)
        parking_data = []
        for parking in parking_locations:
            parking_data.append({
                'id'    :parking.id,
                'address':parking.address,
                'lat'   :parking.lat,
                'lon'   :parking.lon,
                'document': parking.parking_paper.url if parking.parking_paper else None,
                'is_paperverified': parking.is_paperverified,
            })
        return Response(parking_data,status=status.HTTP_200_OK)


class ViewReservation(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        # user = UserModel.objects.get(id=request.user.id)
        reservations = Reservation.objects.filter(user = request.user.id)
        reservation_data = []
        for reservation in reservations:
            reservation_data.append({
                'address'   : reservation.parking.address,
                'start_time': reservation.start_time,
                'end_time'  : reservation.end_time,
                'amount'    : reservation.total_amount
            })
            return Response(reservation_data, status = status.HTTP_200_OK)

class AdminParkingVIew(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        parking_locations = ParkingLocation.objects.all()
        parking_data=[]
        for parking in parking_locations:
            parking_data.append({
                'id'        :parking.id,
                'address'   :parking.address,
                'fee'       :parking.fee,
                'used_spot' :parking.used_spot,
                'total_spot':parking.total_spot,
                'document'  :parking.parking_paper.url if parking.parking_paper else None,
                'is_paperverified':parking.is_paperverified,
            })
        return Response(parking_data,status=status.HTTP_200_OK)

class ViewCustomerReservation(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        reservations = Reservation.objects.filter(user=request.user.id)
        reservation_data=[]
        for reservation in reservations:
            reservation_data.append({
                # 'id'        :reserve.id,
                'address'   :reservation.parking.address,
                'start_time':reservation.start_time,
                'end_time'  :reservation.end_time,
                'total_amount':reservation.total_amount,
            })
        return Response(reservation_data,status=status.HTTP_200_OK)


class ViewParkingReservation(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,id):
        reservations = Reservation.objects.filter(park=id)
        reservation_data=[]
        for reservation in reservations:
            reservation_data.append({
                # 'id'        :reserve.id,
                'address'   :reservation.parking.address,
                'start_time':reservation.start_time,
                'end_time'  :reservation.end_time,
                'total_amount':reservation.total_amount,
            })
        return Response(reservation_data,status=status.HTTP_200_OK)

