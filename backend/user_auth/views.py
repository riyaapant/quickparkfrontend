from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login, logout,get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.db import models
from .models import Customer,Owner,Payment,KhaltiPayment
from .serializers import UserSerializer,LoginSerializer, UpdateProfileSerializer
from .sendemail import send_verification,reset_password
from .khalti import KhaltiVerification,KhaltiInitiate
from decimal import Decimal
# import asyncio
# from .permissions import IsAdmin

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
                'balance'   : user.balance,
                'address'   : user.address,
                'document'  : user.owner.home_paper.url if user.owner.home_paper else None,
                'is_owner'  : user.is_owner,
                'is_emailverified': user.is_emailverified,
                'is_paperverified': user.owner.is_paperverified
            }, status= status.HTTP_200_OK)
        elif user.is_owner==False:
            return Response({
                'firstName' : user.first_name,
                'lastName'  : user.last_name,
                'email'     : user.email,
                'profile'   : user.profile_image.url if user.profile_image else None,
                'contact'   : user.contact,
                'balance'   : user.balance,
                'address'   : user.address,
                'document'  : user.customer.license_paper.url if user.customer.license_paper else None,
                'vehicleId' : user.customer.vehicle_id,
                'is_owner'  : user.is_owner,
                'is_emailverified': user.is_emailverified,
                'is_paperverified': user.customer.is_paperverified
            }, status= status.HTTP_200_OK)
        return Response("is_owner is not defined in user", status=status.HTTP_404_NOT_FOUND)

class UpdateUser(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = UserModel.objects.get(id=request.user.id)
        user.is_owner = False if user.is_owner else True
        user.save()
        if user.is_owner==True:
            return Response({
                'firstName' : user.first_name,
                'lastName'  : user.last_name,
                'email'     : user.email,
                'profile'   : user.profile_image.url if user.profile_image else None,
                'contact'   : user.contact,
                'balance'   : user.balance,
                'address'   : user.address,
                'document'  : user.owner.home_paper.url if user.owner.home_paper else None,
                'is_owner'  : user.is_owner,
                'is_emailverified': user.is_emailverified,
                'is_paperverified': user.owner.is_paperverified
            }, status= status.HTTP_200_OK)
        elif user.is_owner==False:
            return Response({
                'firstName' : user.first_name,
                'lastName'  : user.last_name,
                'email'     : user.email,
                'profile'   : user.profile_image.url if user.profile_image else None,
                'contact'   : user.contact,
                'balance'   : user.balance,
                'address'   : user.address,
                'document'  : user.customer.license_paper.url if user.customer.license_paper else None,
                'vehicleId' : user.customer.vehicle_id,
                'is_owner'  : user.is_owner,
                'is_emailverified': user.is_emailverified,
                'is_paperverified': user.customer.is_paperverified
            }, status= status.HTTP_200_OK)


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
                result =  send_verification(user)
                return Response(f'Verification Link is sent to your email address at {user.email}',status= status.HTTP_201_CREATED)
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
                        'balance'   : user.balance,
                        'address'   : user.address,
                        'document'  : user.owner.home_paper.url if user.owner.home_paper else None,
                        'is_owner'  : user.is_owner,
                        'is_emailverified': user.is_emailverified,
                        'is_paperverified': user.owner.is_paperverified
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
                        'balance'   : user.balance,
                        'address'   : user.address,
                        'document'  : user.customer.license_paper.url if user.customer.license_paper else None,
                        'vehicleId' : user.customer.vehicle_id,
                        'is_owner'  : user.is_owner,
                        'is_emailverified': user.is_emailverified,
                        'is_paperverified': user.customer.is_paperverified
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


class DebitBalance(APIView):
    # def put(self,request):
    #     user = UserModel.objects.get(it=request.user.id)
    #     balance = request.data['balance']
    #     if balance:
    pass
            

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
            if user and user.is_superuser==True:
                refresh = RefreshToken.for_user(user)
                login(request,user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                },status = status.HTTP_202_ACCEPTED)
            else:
                return Response('Admin Login Failed', status = status.HTTP_404_NOT_FOUND)
        return Response('Unacceptable Request',status = status.HTTP_406_NOT_ACCEPTABLE)


class AdminViewCustomer(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        users = UserModel.objects.all()
        customer_data = []
        for user in users:
            if user.is_superuser==False:
                if user.customer.license_paper is not None and user.customer.is_paperverified==True:
                    customer_data.append({
                        'id'        : user.id,
                        'name'      : user.first_name+' '+user.last_name,
                        'email'     : user.email,
                        'contact'   : user.contact,
                        'vehicle_id': user.customer.vehicle_id,
                        'document'  : user.customer.license_paper.url if user.customer.license_paper else None,
                        'is_paperverified': user.customer.is_paperverified,
                    })
        return Response(customer_data, status=status.HTTP_200_OK)

class AdminViewOwner(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        users = UserModel.objects.all()
        owner_data = []
        for user in users:
            if user.is_superuser==False:
                if user.owner.home_paper is not None and user.owner.is_paperverified==True:
                    owner_data.append({
                        'id'        : user.id,
                        'name'      : user.first_name+' '+user.last_name,
                        'email'     : user.email,
                        'contact'   : user.contact,
                        'document'  : user.owner.home_paper.url if user.owner.home_paper else None,
                        'is_paperverified': user.owner.is_paperverified,
                    })
        return Response(owner_data, status= status.HTTP_200_OK)

class AdminViewPendingCustomer(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        users = UserModel.objects.all()
        customer_data = []
        for user in users:
            if user.is_superuser==False:
                if user.customer.license_paper is not None and user.customer.is_paperverified==False:
                    customer_data.append({
                        'id'        : user.id,
                        'name'      : user.first_name+' '+user.last_name,
                        'email'     : user.email,
                        'contact'   : user.contact,
                        'vehicle_id': user.customer.vehicle_id,
                        'document'  : user.customer.license_paper.url if user.customer.license_paper else None,
                        'is_paperverified': user.customer.is_paperverified,
                    })
        return Response(customer_data, status=status.HTTP_200_OK)

class AdminViewPendingOwner(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        users = UserModel.objects.all()
        owner_data = []
        for user in users:
            if user.is_superuser==False:
                if user.owner.home_paper is not None and user.owner.is_paperverified==False:
                    owner_data.append({
                        'id'        : user.id,
                        'name'      : user.first_name+' '+user.last_name,
                        'email'     : user.email,
                        'contact'   : user.contact,
                        'document'  : user.owner.home_paper.url if user.owner.home_paper else None,
                        'is_paperverified': user.owner.is_paperverified,
                    })
        return Response(owner_data, status= status.HTTP_200_OK)

class AdminVerifyCustomer(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,id):
        user = UserModel.objects.get(id=id)
        user.customer.is_paperverified=True
        user.customer.save()
        return Response('Customer Paper Verified',status=status.HTTP_200_OK)

class AdminVerifyOwner(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,id):
        user = UserModel.objects.get(id=id)
        user.owner.is_paperverified=True
        user.owner.save()
        return Response('Owner Paper Verified', status=status.HTTP_200_OK)

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


class ViewCreditedPayment(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        payments = Payment.objects.all().filter(to_user=request.user.id)
        payment_data=[]
        for payment in payments:
            user = UserModel.objects.get(id=payment.from_user)
            payment_data.append({
                'From'  :f'{user.first_name} {user.last_name}' if user.is_superuser==False else 'Khalti',
                'Amount':payment.amount,
                'Time'  :payment.payment_date,
            })
        return Response(payment_data, status=status.HTTP_200_OK)


class ViewDebitedPayment(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        payments = Payment.objects.all().filter(from_user=request.user.id)
        payment_data=[]
        for payment in payments:
            user = UserModel.objects.get(id=payment.from_user)
            payment_data.append({
                'To'  :f'{user.first_name} {user.last_name}',
                'Amount':payment.amount,
                'Time'  :payment.payment_date,
            })
        return Response(payment_data, status=status.HTTP_200_OK)

class KhaltiTopup(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        amount_data = request.data['amount']
        amount = float(amount_data)*100
        user = UserModel.objects.get(id=request.user.id)
        name = f"{user.first_name} {user.last_name}"
        email = user.email
        phone = user.contact
        result = KhaltiInitiate(amount,name,email,phone)
        if result:
            khalti = KhaltiPayment.objects.create(pidx=result['pidx'],user_id=request.user.id,amount=Decimal(amount_data))
            khalti.save()
            return Response(result, status = status.HTTP_200_OK)
        else:
            return Response("Error while fetchine khalti", status= status.HTTP_200_OK)

class KhaltiTopupVerification(APIView):
    permission_classes = [IsAuthenticated]
    def put(self,request):
        user = UserModel.objects.get(id=request.user.id)
        pidx = request.data['pidx']
        verified = KhaltiVerification(pidx)
        print(verified)
        # verified = {'total_amount':'200','pidx':pidx}
        if verified:
            kpayment = KhaltiPayment.objects.get(pidx=verified['pidx'])
            balance = Decimal(verified['total_amount']) / Decimal(100)
            if kpayment.is_verified==False and request.user.id==kpayment.user_id:
                UserModel.objects.filter(id=request.user.id).update(
                    balance = models.F('balance') + balance
                )
                KhaltiPayment.objects.filter(pidx=kpayment.pidx).update(is_verified=True)
                if UserModel.objects.filter(is_superuser=True).exists():
                    admin = UserModel.objects.filter(is_superuser=True).first()
                    payment = Payment.objects.create(from_user=admin.id,to_user=user.id,amount=balance)
                    payment.save()
            return Response(f'Rs:{balance} has been credited to your account', status = status.HTTP_200_OK)
        else:
            return Response('Payment can not be veified', status=status.HTTP_400_BAD_REQUEST)


class ReturnURL(APIView):
    def get(self,request):
        return Response(request.data, status=status.HTTP_200_OK)

