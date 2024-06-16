from django.urls import path
from .consumers import ParkingConsumer

ws_urlspatterns=[
    path("parking/<parking_id>/<vehicle_id>", ParkingConsumer.as_asgi()),
]