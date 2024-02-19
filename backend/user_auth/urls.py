from django.urls import path
from .views import UserRegister,UserLogin,OwnerRegister,OwnerLogin,AdminRegister,AdminLogin,ForgetPassword,VerifyOtp,ChangePassword,Logout

urlpatterns = [
    path('user/signup',UserRegister.as_view(), name='user_signup'),
    path('user/login',UserLogin.as_view(), name='user_login'),
    path('owner/signup',OwnerRegister.as_view(), name='owner_signup'),
    path('owner/login',OwnerLogin.as_view(), name='owner_login'),
    path('admin/signup',AdminRegister.as_view(), name='admin_signup'),
    path('admin/login',AdminLogin.as_view(), name='admin_login'),
    path('forgetpassword', ForgetPassword.as_view(), name='forgetpassword'),
    path('verifyotp', VerifyOtp.as_view(), name='verifyotp'),
    path('changepassword', ChangePassword.as_view(), name = 'changepassword'),
    path('logout',Logout.as_view(), name='logout'),
]