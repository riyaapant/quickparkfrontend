from django.urls import path
from .views import AddParking

urlpatterns = [
    path('addparking',AddParking.as_view(), name='add_parking'),
]