from django.urls import path
from .views import (
    AddParking,
    ViewParkingLocations,
    ViewOwnParking,
    ViewParking,
    ViewReservation,
    AdminParkingVIew,
    ViewReservation,
)

urlpatterns = [
    path('addparking',AddParking.as_view(), name='add_parking'),
    path('viewparkinglocations',ViewParkingLocations.as_view(), name='view_parking_locations'),
    path('viewownparking',ViewOwnParking.as_view(), name='view_own parking'),
    path('viewparking/<id>', ViewParking.as_view(), name='View_parking'),
    path('viewreservation', ViewReservation.as_view(), name='view_reservations'),
    path('viewparking/adminview', AdminParkingVIew.as_view(), name='admin_view_parking'),
    path('view/customer/reservation', ViewCustomerReservation.as_view(), name='view_customer_reservation'),
    path('view/parking/reservation/<id>', ViewParkingReservation.as_view(), name='view_parking_reservation'),
]