from django.urls import re_path, path
from consumers import ViewParking

ws_urlspatterns=[
    re_path(r"^view/", ViewParking.as_asgi()),
]