"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""


import os

from django.core.asgi import get_asgi_application

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
# from rest_framework_simplejwt.authentication import JWTAuthentication
# from parking.middleware import JWTAuthMiddleware
# import parking.routing
from django.contrib.staticfiles.handlers import ASGIStaticFilesHandler


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = get_asgi_application()

from parking.routing import ws_urlspatterns

application = ProtocolTypeRouter({
    'http':ASGIStaticFilesHandler(application),
    'websocket':AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(ws_urlspatterns),
        )
    )
})
