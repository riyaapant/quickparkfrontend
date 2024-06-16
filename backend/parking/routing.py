from django.urls import path
from .consumers import ParkingConsumers

ws_urlspatterns=[
    path("parking/<parking_id>/<vehicle_id>", ParkingConsumers.as_asgi()),
]