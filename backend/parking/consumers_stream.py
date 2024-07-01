from channels.generic.websocket import AsyncWebsocketConsumer
import json
from PIL import Image
from io import BytesIO
import base64
import numpy as np


class StreamConsumers(AsyncWebsocketConsumer):
    async def connect(self):
        self.parking_id = self.scope['url_route']['kwargs']['parking_id']
        self.parking_group_name = f'parking_{self.parking_id}'
        await self.channel_layer.group_add(self.parking_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.parking_group_name, self.channel_name)

    async def receive(self,text_data=None,bytes_data=None):
        
        # if text_data:
        #     print(text_data)
        #     frame_data = base64.b64decode(text_data)
        #     frame_np = np.frombuffer(frame_data, np.uint8)
        #     await self.channel_layer.group_send(self.parking_group_name, {
        #         'type': 'send_stream',
        #         'value': frame_np
        #     })            

        if bytes_data:
            # image = Image.open(BytesIO(bytes_data))
            # await self.send(text_data)
            # resized_image = image.resize()
            # await self.send(json.dumps({
            #     'image':bytes_data,
            # }))
            # await self.group_send({

            # })
            # print(bytes_data)
            # await self.send(bytes_data=bytes_data)
            await self.channel_layer.group_send(self.parking_group_name, {
                'type': 'send_stream',
                'value': bytes_data
            })
    async def send_stream(self,event):
        bytes_data = event['value']
        await self.send(bytes_data=bytes_data)



        