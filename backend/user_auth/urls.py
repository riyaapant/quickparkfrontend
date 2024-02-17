from django.urls import path
from .views import UserRegister,UserLogin,Logout

urlpatterns = [
    path('api/signup',UserRegister.as_view(), name='signup'),
    path('api/login',UserLogin.as_view(), name='login'),
    path('api/logout',Logout.as_view(), name='logout'),
]