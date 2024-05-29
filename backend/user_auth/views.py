from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login, logout,get_user_model
from django.contrib.auth.tokens import default_token_generator
from .serializers import UserSerializer,LoginSerializer, UpdateProfileSerializer
from .sendemail import send_verification,reset_password

UserModel = get_user_model()

class Profile(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = UserModel.objects.get(id=request.user.id)
        if user.is_owner==True:
            return Response({
                'firstName' : user.first_name,
                'lastName'  : user.last_name,
                'email'     : user.email,
                'profile'   : user.profile_image.url if user.profile_image else None,
                'contact'   : user.contact,
                'address'   : user.address,
                'document'  : user.owner.home_paper.url if user.owner.home_paper else None,
                'is_owner'  : user.is_owner
            }, status= status.HTTP_200_OK)
        elif user.is_owner==False:
            return Response({
                'firstName' : user.first_name,
                'lastName'  : user.last_name,
                'email'     : user.email,
                'profile'   : user.profile_image.url if user.profile_image else None,
                'contact'   : user.contact,
                'address'   : user.address,
                'document'  : user.customer.license_paper.url if user.customer.license_paper else None,
                'vehicleId' : user.customer.vehicle_id,
                'is_owner'  : user.is_owner,
            }, status= status.HTTP_200_OK)
        return Response("is_owner is not defined in user", status=status.HTTP_404_NOT_FOUND)

class UpdateUser(APIView):
    def get(self,request):
        user = UserModel.objects.get(id=request.user.id)
        user.is_owner = False if user.is_owner else True
        user.save()
        return Response("Updated Successfully", status=status.HTTP_200_OK)

class UpdateProfile(APIView):
    def put(self,request):
        user = UserModel.objects.get(id=request.user.id)
        if user.is_authenticated:
            return Response("Fuck off", status=status.HTTP_200_OK)
        serializer = UpdateProfileSerializer(user, data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response("Profile Updated", status = status.HTTP_200_OK)
        return Response("Profile updateation Failed", status =status.HTTP_400_BAD_REQUEST)

class UserRegister(APIView):
    def post(self,request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create_u(request.data)
            if user:
                result = send_verification(user)
                if result ==1:
                    return Response('Verification Link is sent to your email address',status= status.HTTP_201_CREATED)
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

class Register(APIView):
    def post(self,request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create_u(request.data)
            if user:
                result = send_verification(user)
                if result ==1:
                    return Response(f'Verification Link is sent to your email address at {user.email}',status= status.HTTP_201_CREATED)
                else:
                    return Response('Email Not found', status= status.HTTP_404_NOT_FOUND)
            else:
                return Response('User Registration Failed', status = status.HTTP_400_BAD_REQUEST)
        return Response('Unacceptable Request', status = status.HTTP_406_NOT_ACCEPTABLE)

class Login(APIView):
    def post(self,request):
        serializer = LoginSerializer(data = request.data)
        if serializer.is_valid():
            user = authenticate(username = request.data['email'], password = request.data['password'])
            # if user and user.is_superuser==False:
            if user:
                login(request,user)
                refresh = RefreshToken.for_user(user)
                if user.is_owner==True:
                    return Response({
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                        'firstName' : user.first_name,
                        'lastName'  : user.last_name,
                        'email'     : user.email,
                        'profile'   : user.profile_image.url if user.profile_image else None,
                        'contact'   : user.contact,
                        'address'   : user.address,
                        'document'  : user.owner.home_paper.url if user.owner.home_paper else None,
                        'is_owner'  : user.is_owner
                    }, status= status.HTTP_200_OK)
                elif user.is_owner==False:
                    return Response({
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                        'firstName' : user.first_name,
                        'lastName'  : user.last_name,
                        'email'     : user.email,
                        'profile'   : user.profile_image.url if user.profile_image else None,
                        'contact'   : user.contact,
                        'address'   : user.address,
                        'document'  : user.customer.license_paper.url if user.customer.license_paper else None,
                        'vehicleId' : user.customer.vehicle_id,
                        'is_owner'  : user.is_owner,
                    }, status= status.HTTP_200_OK)
            else:
                return Response("Invalid login credentials \n Have you verified your account?", status = status.HTTP_404_NOT_FOUND)
        else:
            return Response("Unacceptable Request", status = status.HTTP_406_NOT_ACCEPTABLE)

class VehicleID(APIView):
    def put(self,request):
        vehicle = request.data['vehicle_id']
        user = UserModel.objects.get(id=request.user.id)
        customer = user.customer
        customer.vehicle_id = vehicle
        customer.save()
        return Response('Vehicle Number updated', status=status.HTTP_200_OK)

class UploadProfile(APIView):
    permission_classes = [IsAuthenticated]
    def put(self,request):
        # try:
        profile = request.data['profile']
        user = UserModel.objects.get(id=request.user.id)
        # user = UserModel.objects.get(pk=id)
        user.profile_image = profile
        user.save()
        return Response("Profile picture uploaded", status = status.HTTP_200_OK)
        # except:
        #     return Response("Profile update failed", status=status.HTTP_400_BAD_REQUEST)

class UploadFileCustomer(APIView):
    permission_classes = [IsAuthenticated]
    def put(self,request):
        document = request.data['file']
        user = UserModel.objects.get(id=request.user.id)
        # user = UserModel.objects.get(pk=id)
        customer = user.customer
        customer.license_paper = document
        customer.save()
        return Response("File Uploaded", status = status.HTTP_200_OK)
        # except:
        #     return Response("File update failed", status=status.HTTP_400_BAD_REQUEST)


class UploadFileOwner(APIView):
    permission_classes = [IsAuthenticated]
    def put(self,request):
        document = request.data['file']
        user = UserModel.objects.get(id=request.user.id)
        # user = UserModel.objects.get(pk=id)
        owner = user.owner
        owner.home_paper = document
        owner.save()
        return Response("File Uploaded", status = status.HTTP_200_OK)
        # except:
        #     return Response("Profile update failed", status=status.HTTP_400_BAD_REQUEST)

class ImageUpload(APIView):
    def post(self,request,usr):
        if usr=='customer':
            customer_obj = Customer.objects.get(user=request.user)
            serialzer = CustomerImageSerializer(instance=customer_obj, data=request.data)
        else:
            owner_obj = Owner.objects.get(user=request.user)
            serializer = OwnerImageSerializer(instance=owner_obj, data=request.data)
        if serializer.is_valid():
            serializer.save()

# class OwnerRegister(APIView):
#     def post(self,request):
#         serializer = UserSerializer(data=request.data)
#         if serializer.is_valid(raise_exception=True):
#             user = serializer.create_o(request.data)
#             if user:
#                 return Response('Owner Registered Successfully', status= status.HTTP_201_CREATED)
#             else:
#                 return Response('Owner Registration Failed', status = status.HTTP_400_BAD_REQUEST)
#         return Response('Unacceptable Request', status = status.HTTP_406_NOT_ACCEPTABLE)

# class OwnerLogin(APIView):
#     def post(self,request):
#         serializer = LoginSerializer(data = request.data)
#         if serializer.is_valid():
#             user = authenticate(username = request.data['email'],password = request.data['password'])
#             if user and user.is_owner==True and user.is_superuser==False:
#                 login(request,user)
#                 return Response('Owner Loggedin successfully',status = status.HTTP_202_ACCEPTED)
#             else:
#                 return Response('Owner Login Failed', status = status.HTTP_404_NOT_FOUND)
#         return Response('Unacceptable Request',status = status.HTTP_406_NOT_ACCEPTABLE)


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
            user.is_emailverified = True
            user.save()
            return Response("Email Verification successfull",status = status.HTTP_200_OK)
        else:
            return Response("Invalid Token", status = status.HTTP_406_NOT_ACCEPTABLE)

class ResetPassword(APIView):
    def put(self,request,id,token):
        user = UserModel.objects.get(pk=id)
        password = request.data['password']
        if default_token_generator.check_token(user,token):
            user.set_password(password)
            user.save()
            return Response('Password reset Successful', status = status.HTTP_200_OK)
        else:
            return Response('Invalid token', status = status.HTTP_406_NOT_ACCEPTABLE)

class ChangePassword(APIView):
    permission_classes = [IsAuthenticated]
    def put(self,request):
        user = UserModel.objects.get(id=request.user.id)
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

