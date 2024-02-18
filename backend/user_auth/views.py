from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework import status
from django.contrib.auth import authenticate, login, logout,get_user_model
from .serializers import UserSerializer,LoginSerializer
    
UserModel = get_user_model()

class UserRegister(APIView):
    def post(self,request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create_u(request.data)
            if user:
                return Response('User Registered Successfully', status= status.HTTP_201_CREATED)
            else:
                return Response('User Registration Failed', status = status.HTTP_400_BAD_REQUEST)
        return Response('Unacceptable Request', status = status.HTTP_406_NOT_ACCEPTABLE)

class UserLogin(APIView):
    def post(self,request):
        serializer = LoginSerializer(data = request.data)
        if serializer.is_valid():
            user = authenticate(username = request.data['email'],password = request.data['password'])
            if user and user.is_owner==False and user.is_superuser==False:
                login(request,user)
                return Response('User Loggedin successfully',status = status.HTTP_202_ACCEPTED)
            else:
                return Response('User Login Failed', status = status.HTTP_404_NOT_FOUND)
        return Response('Unacceptable Request',status = status.HTTP_406_NOT_ACCEPTABLE)

class OwnerRegister(APIView):
    def post(self,request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create_o(request.data)
            if user:
                return Response('Owner Registered Successfully', status= status.HTTP_201_CREATED)
            else:
                return Response('Owner Registration Failed', status = status.HTTP_400_BAD_REQUEST)
        return Response('Unacceptable Request', status = status.HTTP_406_NOT_ACCEPTABLE)

class OwnerLogin(APIView):
    def post(self,request):
        serializer = LoginSerializer(data = request.data)
        if serializer.is_valid():
            user = authenticate(username = request.data['email'],password = request.data['password'])
            if user and user.is_owner==True and user.is_superuser==False:
                login(request,user)
                return Response('Owner Loggedin successfully',status = status.HTTP_202_ACCEPTED)
            else:
                return Response('Owner Login Failed', status = status.HTTP_404_NOT_FOUND)
        return Response('Unacceptable Request',status = status.HTTP_406_NOT_ACCEPTABLE)


class AdminRegister(APIView):
    def post(self,request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create_a(request.data)
            if user:
                return Response('Admin Registered Successfully', status= status.HTTP_201_CREATED)
            else:
                return Response('Admin Registration Failed', status = status.HTTP_400_BAD_REQUEST)
        return Response('Unacceptable Request', status = status.HTTP_406_NOT_ACCEPTABLE)

class AdminLogin(APIView):
    def post(self,request):
        serializer = LoginSerializer(data = request.data)
        if serializer.is_valid():
            user = authenticate(username = request.data['email'],password = request.data['password'])
            if user and user.is_owner==False and user.is_superuser==True:
                login(request,user)
                return Response('Admin Loggedin successfully',status = status.HTTP_202_ACCEPTED)
            else:
                return Response('Admin Login Failed', status = status.HTTP_404_NOT_FOUND)
        return Response('Unacceptable Request',status = status.HTTP_406_NOT_ACCEPTABLE)

class VerifyOtp(APIView):
    def post(self,request):
        return 0

class ForgetPassword(APIView):
    def post(self,request):
        return 0

class Logout(APIView):
    def get(self,request):
        logout(request)
        return Response("User logged out successfully", status = status.HTTP_200_OK)

