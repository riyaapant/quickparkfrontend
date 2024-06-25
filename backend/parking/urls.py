from django.urls import path
from .views import (
    AddParking,
    ViewParkingLocations,
    ViewOwnParking,
    ViewParking,
    ViewReservation,
    AdminParkingVIew,
    ViewCustomerReservation,
    ViewParkingReservation,
    UploadParkingFile,
    ViewUnverifiedParkingLocations,
)

urlpatterns = [
    path('addparking',AddParking.as_view(), name='add_parking'),
    path('viewparkinglocations',ViewParkingLocations.as_view(), name='view_parking_locations'),
    path('viewparkinglocations/unverified',ViewUnverifiedParkingLocations.as_view(), name='view_unverified_parking_locations'),
    path('viewownparking',ViewOwnParking.as_view(), name='view_own parking'),
    path('viewparking/<id>', ViewParking.as_view(), name='View_parking'),
    path('viewreservation', ViewReservation.as_view(), name='view_reservations'),
    path('admin/view/parking', AdminParkingVIew.as_view(), name='admin_view_parking'),
    path('view/customer/reservation', ViewCustomerReservation.as_view(), name='view_customer_reservation'),
    path('view/parking/reservation/<id>', ViewParkingReservation.as_view(), name='view_parking_reservation'),
    path('upload/parking/file/<id>', UploadParkingFile.as_view(), name='upload_parking_file'),
]