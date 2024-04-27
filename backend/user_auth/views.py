from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework import status
from django.contrib.auth import authenticate, login, logout,get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from .serializers import UserSerializer,LoginSerializer
from .sendemail import send_verification,reset_password
    
UserModel = get_user_model()

class UserRegister(APIView):
    def post(self,request):
        # if request.data['firstName']:
        #     request.data['first_name'] = request.data['firstName']
        #     request.data['last_name']  = request.data['lastName']
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create_u(request.data)
            if user:
                result = send_verification(user)
                if result ==1:
                    return Response('Verification Link is sent to your email address',status= status.HTTP_200_OK)
                else:
                    return Response('Email Not found', status= status.HTTP_404_NOT_FOUND)
            else:
                return Response('User Registration Failed', status = status.HTTP_400_BAD_REQUEST)
        return Response('Unacceptable Request', status = status.HTTP_406_NOT_ACCEPTABLE)

class UserLogin(APIView):
    def post(self,request):
        serializer = LoginSerializer(data = request.data)
        if serializer.is_valid():
            user = authenticate(username = request.data['email'],password = request.data['password'])
            if user and user.is_owner==False and user.is_superuser==False and user.is_active==True:
                login(request,user)
                return Response('User Loggedin successfully',status = status.HTTP_202_ACCEPTED)
            else:
                return Response('User Login Failed', status = status.HTTP_404_NOT_FOUND)
        return Response('Unacceptable Request',status = status.HTTP_406_NOT_ACCEPTABLE)

class Login(APIView):
    def post(self,request):
        serializer = LoginSerializer(data = request.data)
        if serializer.is_valid():
            user = authenticate(username = request.data['email'], password = request.data['password'])
            if user:
                login(request,user)
                if user.is_owner==False and user.is_superuser==True:
                    return Response("admin", status = status.HTTP_200_OK)
                elif user.is_owner==True and user.is_superuser==False:
                    return Response("owner", status = status.HTTP_200_OK)
                else:
                    return Response("usertest", status = status.HTTP_200_OK)
            else:
                return Response("Invalid login credentials \n Have you verified your account?", status = status.HTTP_404_NOT_FOUND)
        else:
            return Response("Unacceptable Request", status = status.HTTP_406_NOT_ACCEPTABLE)
                


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


class ForgetPassword(APIView):
    def post(self,request):
        email = request.data['email'].strip()
        if email and UserModel.objects.filter(email=email).exists():
            user_obj = UserModel.objects.get(email=email)
            result = reset_password(user_obj)
            # subject = "Password Recovery"
            # recipients = email
            # otp = 0
            # message = "Please enter this otp:"+ str(otp) + " to reset your account."
            # result = send_email(subject,message,recipients)
            if result == 1:
                return Response('Password reset instruction sent successfully',status=status.HTTP_200_OK)
            else:
                return Response('Password recovery failed',status = status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response('Invalid email or user does not exists with this email', status = status.HTTP_404_NOT_FOUND)

class EmailVerification(APIView):
    def get(self,request,id,token):
        # token = request.GET.get('token')

        # try:
        # user_id = force_str(urlsafe_base64_decode(token))
        user = UserModel.objects.get(pk=id)
        # except:
        #     return Response("Invalid Token",status = status.HTTP_406_NOT_ACCEPTABLE)

        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response("Email Verification successfull",status = status.HTTP_200_OK)
        else:
            return Response("Invalid Token", status = status.HTTP_406_NOT_ACCEPTABLE)

class ResetPassword(APIView):
    def post(self,request,id,token):
        user = UserModel.objects.get(pk=id)
        password = request.data['password']
        if default_token_generator.check_token(user,token):
            user.set_password(password)
            user.save()
            return Response('Password reset Successful', status = status.HTTP_200_OK)
        else:
            return Response('Invalid token', status = status.HTTP_406_NOT_ACCEPTABLE)

class ChangePassword(APIView):
    def post(self,request):
        user = request.user
        if request.data['old_password'] and request.data['new_password']:
            if user.check_password(request.data['old_password']):
                user.set_password(request.data['new_password'])
                user.save()
                return Response('Password changed Successfully', status = status.HTTP_200_OK)
            else:
                return Response('Please enter valid old password', status = status.HTTP_406_NOT_ACCEPTABLE)
        return Response('Invalid REquest', status = status.HTTP_400_BAD_REQUEST)
            



class Logout(APIView):
    def get(self,request):
        logout(request)
        return Response("User logged out successfully", status = status.HTTP_200_OK)

