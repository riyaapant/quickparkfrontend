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
            user = serializer.create(request.data)
            if user:
                return Response('User Created Successfully', status= status.HTTP_201_CREATED)
        return Response('User Registration Failed', status = status.HTTP_400_BAD_REQUEST)

class UserLogin(APIView):
    def post(self,request):
        serializer = LoginSerializer(data = request.data)
        if serializer.is_valid():
            user = authenticate(username = request.data['email'],password = request.data['password'])
            if user:
                login(request,user)
                return Response('User Loggedin successfully',status = status.HTTP_202_ACCEPTED)
            else:
                return Response("Login Failed", status = status.HTTP_404_NOT_FOUND)
        return Response("Invalid Login",status = status.HTTP_400_BAD_REQUEST)

class Logout(APIView):
    def get(self,request):
        logout(request)
        return Response("User logged out successfully", status = status.HTTP_202_ACCEPTED)

