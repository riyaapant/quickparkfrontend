# from channels.middleware.base import BaseMiddleware
# from django.contrib.auth.models import AnonymousUser
# from django.db import close_old_connections
# from rest_framework_simplejwt.tokens import UntypedToken
# from rest_framework_simplejwt.authentication import JWTAuthentication
# from channels.db import database_sync_to_async
# # from jwt import InvalidTokenError
# from urllib.parse import parse_qs

# @database_sync_to_async
# def get_user_from_token(token):
#     try:
#         UntypedToken(token)
#         validated_token = JWTAuthentication().get_validated_token(token)
#         user = JWTAuthentication().get_user(validated_token)
#         return user
#     except:
#         return AnonymousUser()

# class JWTAuthMiddleware(BaseMiddleware):
#     async def __call__(self, scope, receive, send):
#         close_old_connections()
#         query_string = parse_qs(scope["query_string"].decode())
#         token = query_string.get("token", [None])[0]
        
#         scope['user'] = await get_user_from_token(token)
        
#         return await super().__call__(scope, receive, send)



from channels.auth import AuthMiddlewareStack
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from channels.db import database_sync_to_async
from urllib.parse import parse_qs

@database_sync_to_async
def get_user_from_token(token):
    try:
        UntypedToken(token)
        validated_token = JWTAuthentication().get_validated_token(token)
        user = JWTAuthentication().get_user(validated_token)
        return user
    except:
        return AnonymousUser()

@database_sync_to_async
def get_user(scope):
    close_old_connections()
    query_string = parse_qs(scope["query_string"].decode())
    token = query_string.get("token", [None])[0]
    
    if token:
        user = get_user_from_token(token)
        return user
    else:
        return AnonymousUser()

class JWTAuthMiddleware:
    """
    Custom middleware that authenticates users based on a JWT token passed in the query string.
    """

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope):
        # Get the user from the token
        scope['user'] = await get_user(scope)

        return await self.inner(scope)

