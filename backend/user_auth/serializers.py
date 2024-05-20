from rest_framework import serializers
from django.core.exceptions import ValidationError
# from rest_framework_cloudinary.fields import CloudinaryField
# from cloudinary_storage.models import CloudinaryField
from django.contrib.auth import get_user_model
from .models import Customer, Owner


UserModel=get_user_model()

class UserSerializer(serializers.ModelSerializer):
    # profile = CloudinaryField('profile')
    class Meta:
        model = UserModel
        fields = '__all__'
    def create_u(self,data):
        user_obj = UserModel.objects.create_user(email = data['email'], password = data['password'],first_name = data['first_name'],last_name = data['last_name'],contact=data['contact'],address=data['address'])
        # customer_obj = Customer.objects.create(user=user_obj,)
        return user_obj

    # def create_o(self,data):
    #     owner_obj = UserModel.objects.create_owner(email = data['email'], password = data['password'],first_name = data['first_name'],last_name = data['last_name'],contact=data['contact'],address=data['address'])
    #     return owner_obj

    def create_a(self,data):
        admin_obj = UserModel.objects.create_admin(email = data['email'], password = data['password'],first_name = data['first_name'],last_name = data['last_name'])
        return admin_obj

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


# class ProfileSerializer(serializers.Serializer):
#     profile = serializers.CloudinaryField('profile')

# class LicenseSerializer(serializers.Serializer):
#     license_paper = serializers.CloudinaryField('identity')

# class DocumentsSerializer(serializers.Serializer):
#     home_paper = serializers.CloudinaryField('documents')