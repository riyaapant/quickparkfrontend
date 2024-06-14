from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ParkingLocation, Reservation
import json
from django.conf import settings
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class ParkingConsumers(AsyncWebsocketConsumer):

    # channel_layer = settings.CHANNEL_LAYERS["default"]

    async def connect(self):
        # if self.scope['user'].is_anonymous:
        #     await self.close()
        #     raise DenyConnection("Authentication Failed")
        self.parking_id =self.scope['url_route']['kwargs']['id']
        self.parking_group_name = f'parking_{self.parking_id}'

        await self.channel_layer.group_add(self.parking_group_name,self.channel_name)

        await self.accept()

        parking = await self.get_parking(self.parking_id)
        used_spot = parking.used_spot
        await self.send(text_data= json.dumps({
            'used_spots': used_spot
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.parking_group_name,
            self.channel_name
        )

    async def receive(self,text_data):
        data = json.loads(text_data)
        action = data.get('action')
        if action == 'reserve':
            await self.reserve(self.parking_id)
        elif action == 'release':
            await self.release(self.parking_id)


    async def reserve(self,parking_id):
        parking = await self.get_parking(parking_id)
        parking.used_spot += 1

        await self.channel_layer.group_send(
            self.parking_group_name,{
                'type':'parking_update',
                'used_spot':parking.used_spot
            }
        )

        await self.save_parking(parking)

        # await reservation

    async def release(self, parking_id):
        parking = await self.get_parking(parking_id)
        parking.used_spot -= 1
        used_spot = parking.used_spot

        await self.channel_layer.group_send(
            self.parking_group_name,{
                'type':'parking_update',
                'used_spot':parking.used_spot
            }
        )

        await self.save_parking(parking)

        

    async def parking_update(self, data):
        used_spot = data['used_spot']

        await self.send(text_data = json.dumps({
            'used_spot': used_spot
        }))

    @database_sync_to_async
    def get_parking(self,parking_id):
        parking = ParkingLocation.objects.get(id=parking_id)
        return parking

    
    @database_sync_to_async
    def save_parking(self, parking):
        parking.save()