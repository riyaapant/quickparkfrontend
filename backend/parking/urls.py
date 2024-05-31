from django.urls import path
from .views import (
    AddParking,
    ViewParkingLocations,
    ViewOwnParking,
    ViewParking,
    ViewReservation
)

urlpatterns = [
    path('addparking',AddParking.as_view(), name='add_parking'),
    path('viewparkinglocations',ViewParkingLocations.as_view(), name='view_parking_locations'),
    path('viewownparking',ViewOwnParking.as_view(), name='view_own parking'),
    path('viewparking/<id>', ViewParking.as_view(), name='View_parking'),
    path('viewreservation', ViewReservation.as_view(), name='view_reservations'),
]