from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

class AddParking(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        return 0

class ViewParkingLocation(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        return 0

