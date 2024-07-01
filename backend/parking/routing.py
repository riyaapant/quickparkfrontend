from django.urls import path
from .consumers import ParkingConsumer
from .consumers_iot import IOTParkingConsumers
from .consumers_stream import StreamConsumers

ws_urlspatterns=[
    path("parking/<parking_id>/<vehicle_id>", ParkingConsumer.as_asgi()),
    path("iot/<parking_id>", IOTParkingConsumers.as_asgi()),
    path("camera/<parking_id>", StreamConsumers.as_asgi()),
]