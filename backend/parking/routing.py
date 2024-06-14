from django.urls import path
from .consumers import ParkingConsumers

ws_urlspatterns=[
    path("parking/<id>", ParkingConsumers.as_asgi()),
]