from django.urls import path
from .views import Register,Login,ImageUpload,AdminRegister,AdminLogin,ForgetPassword,EmailVerification,ResetPassword,ChangePassword

urlpatterns = [
    # path('user/signup',UserRegister.as_view(), name='user_signup'),
    # path('user/login',UserLogin.as_view(), name='user_login'),
    # path('owner/signup',OwnerRegister.as_view(), name='owner_signup'),
    # path('owner/login',OwnerLogin.as_view(), name='owner_login'),
    path('register',Register.as_view(), name='register'),
    path('login',Login.as_view(), name='login'),
    path('<usr>/upload',ImageUpload.as_view(), name='upload'),
    path('admin/signup',AdminRegister.as_view(), name='admin_signup'),
    path('admin/login',AdminLogin.as_view(), name='admin_login'),
    path('forgetpassword', ForgetPassword.as_view(), name='forget_password'),
    path('verify/<id>/<token>', EmailVerification.as_view(), name='verify_email'),
    path('reset/<id>/<token>', ResetPassword.as_view(), name='reset_password'),
    path('changepassword', ChangePassword.as_view(), name = 'change_password'),
    # path('logout',Logout.as_view(), name='logout'),
]