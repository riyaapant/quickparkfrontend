from django.urls import path
from .consumers import ParkingConsumer, IOTParkingConsumers

ws_urlspatterns=[
    path("parking/<parking_id>/<vehicle_id>", ParkingConsumer.as_asgi()),
    path("parking/<id>", IOTParkingConsumers.as_asgi()),
]