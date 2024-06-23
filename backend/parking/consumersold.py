from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ParkingLocation, Reservation
from user_auth.models import Customer,Payment
import json
from django.conf import settings
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from channels.exceptions import StopConsumer
from django.utils import timezone
from decimal import Decimal


UserModel = get_user_model()

class ParkingConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.parking_id =self.scope['url_route']['kwargs']['parking_id']
        self.vehicle_id = self.scope['url_route']['kwargs']['vehicle_id']
        self.parking_group_name = f'parking_{self.parking_id}'

        await self.channel_layer.group_add(self.parking_group_name,self.channel_name)

        await self.accept()

        self.customer = await self.get_customer()
        self.parking = await self.get_parking()
        if self.parking.used_spot < self.parking.total_spot:
            await self.send(text_data= json.dumps({
                'used_spot': self.parking.used_spot,
                'total_spot': self.parking.total_spot,
                'value'   : 'available'
            }))
        else:
            await self.send(text_data= json.dumps({
                'used_spot': self.parking.used_spot,
                'total_spot': self.parking.total_spot,
                'value'   : 'full'
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
            await self.reserve()
        elif action == 'park':
            await self.park()
        elif action == 'release':
            await self.release()


    async def reserve(self):
        parking = self.parking
        customer = self.customer

        if customer.reservation_id:
            return await self.send(text_data=json.dumps({
                'message'   : 'You have already reserved a space'
            }))

        if parking.used_spot == parking.total_spot:
            return await self.send(text_data= json.dumps({
                'message'   : 'Parking is already Full'
            }))

        if await self.get_balance() < parking.fee:
            return await self.send(text_data= json.dumps({
                'message'   : 'Please Recharge your account'
            }))

        await self.save_parking(1)


        await self.channel_layer.group_send(
            self.parking_group_name,{
                'type':'parking_update',
                'used_spot':self.parking.used_spot,
                'total_spot':self.parking.total_spot,
                'value'     : 'Reserved'
            }
        )

        await self.make_reservation(reserv=True)

    async def park(self):
        parking = self.parking
        customer = self.customer


        if customer.reservation and customer.reservation_id:
            await self.save_parking(-1)
            await self.end_reservation()
            customer.reservation_id = None
            customer.reservation = False


        if parking.used_spot == parking.total_spot:
            return await self.send(text_data= json.dumps({
                'message'   : 'Parking is already Full'
            }))

        if customer.reservation_id:
            return await self.send(text_data= json.dumps({
                'message'   : 'You have already parked your car'
            }))

        if await self.get_balance() < parking.fee:
            return await self.send(text_data= json.dumps({
                'message'   : 'Please recharge you account'
            }))

        await self.save_parking(1)


        await self.channel_layer.group_send(
            self.parking_group_name,{
                'type':'parking_update',
                'used_spot':self.parking.used_spot,
                'total_spot':self.parking.total_spot,
                'value'     : 'Parked'
            }
        )

        await self.make_reservation()


    async def release(self):
        parking = self.parking
        customer = self.customer

        if customer.reservation_id is None:
            return await self.send(text_data= json.dumps({
                'message'   : 'You have not reserved any space'
            }))

        if parking.used_spot == 0:
            return await self.send(text_data= json.dumps({
                'message'   : 'Parking is already empty'
            }))

        # parking.used_spot -= 1
        # if parking.used_spot < 0:
        #     parking.used_spot=0
        await self.save_parking(-1)


        await self.channel_layer.group_send(
            self.parking_group_name,{
                'type':'parking_update',
                'used_spot':self.parking.used_spot,
                'total_spot':self.parking.total_spot,
                'value'     : 'Available'
            }
        )

        await self.end_reservation()



    async def parking_update(self, data):
        await self.send(text_data = json.dumps({
            'used_spot': data['used_spot'],
            'total_spot': data['total_spot'],
            'value'     : data['value']
        }))

    @database_sync_to_async
    def get_parking(self):
        parking = ParkingLocation.objects.get(id=self.parking_id)
        return parking

    @database_sync_to_async
    def get_customer(self):
        customer = Customer.objects.get(vehicle_id=self.vehicle_id)
        return customer

    @database_sync_to_async
    def make_reservation(self,reserv=False):
        reservation = Reservation.objects.create(user=self.customer.user,parking=self.parking,reservation=reserv,start_time=timezone.now(),end_time=None,total_amount=None)
        reservation.save()
        self.customer.reservation_id = reservation.id
        self.customer.reservation = reserv
        self.customer.save()

    @database_sync_to_async
    def end_reservation(self):
        reservation = Reservation.objects.get(id=self.customer.reservation_id)
        reservation.end_time = timezone.now()

        time_difference = reservation.end_time - reservation.start_time
        minute_difference = time_difference.total_seconds()/60
        amount_per_minute = self.parking.fee/60
        if self.customer.reservation == True:
            total_amount = amount_per_minute * Decimal(minute_difference)/2
        elif self.customer.reservation ==False:
            total_amount = amount_per_minute * Decimal(minute_difference)
        
        reservation.total_amount = total_amount
        reservation.save()

        self.customer.reservation_id = None
        self.customer.reservetion = False
        self.customer.save()

        user = self.customer.user
        user.balance -= total_amount
        user.save()

        owner = self.parking.user
        owner.balance += (total_amount* Decimal(0.9))
        owner.save()

        payment = Payment.objects.create(from_user=user.first_name+' '+user.last_name,to_user=owner.first_name+' '+owner.last_name,amount=total_amount)
        payment.save()

    @database_sync_to_async
    def get_balance(self):
        return self.customer.user.balance

    @database_sync_to_async
    def save_parking(self,integer):
        self.parking.used_spot += integer
        self.parking.save()