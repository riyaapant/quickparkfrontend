from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ParkingLocation, Reservation
from user_auth.models import Customer, Payment
import json
from django.conf import settings
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db import transaction, models
from decimal import Decimal

UserModel = get_user_model()

class ParkingConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.parking_id = self.scope['url_route']['kwargs']['parking_id']
        self.vehicle_id = self.scope['url_route']['kwargs']['vehicle_id']
        self.parking_group_name = f'parking_{self.parking_id}'

        await self.channel_layer.group_add(self.parking_group_name, self.channel_name)
        await self.accept()

        self.customer = await self.get_customer()
        self.parking = await self.get_parking()
        if self.customer.reservation_id and self.customer.reservation:
            await self.send_parking_status(value='Reserved')
        elif self.customer.reservation_id:
            await self.send_parking_status(value='Parkerd')
        else:
            await self.send_parking_status(value='Reserve')
            

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.parking_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')
        if action == 'reserve':
            await self.reserve()
        elif action == 'park':
            await self.park()
        elif action == 'release':
            await self.release()
        elif action == 'frelease':
            await self.frelease()

    async def frelease(self):
        await self.end_reservation()
        # await self.update_parking(-1)

    async def send_parking_status(self,value):
        if self.parking.used_spot < self.parking.total_spot:
            await self.send(json.dumps({
                'used_spot': self.parking.used_spot,
                'total_spot': self.parking.total_spot,
                'value': value
            }))
        else:
            await self.send(json.dumps({
                'used_spot': self.parking.used_spot,
                'total_spot': self.parking.total_spot,
                'value': 'Full'
            }))

            
    async def reserve(self):
        if self.customer.reservation_id:
            await self.send(json.dumps({'message': 'You have already reserved a space'}))
            return

        if self.parking.used_spot == self.parking.total_spot:
            await self.send(json.dumps({'message': 'Parking is already Full'}))
            return

        # if await self.get_balance() < self.parking.fee:
        #     await self.send(json.dumps({'message': 'Please Recharge your account'}))
        #     return

        await self.update_parking(1)
        await self.channel_layer.group_send(self.parking_group_name, {
            'type': 'parking_update',
            'used_spot': self.parking.used_spot,
            'total_spot': self.parking.total_spot
        })
        await self.send(json.dumps({'value':'Reserved'}))

        await self.make_reservation(reserv=True)

    async def park(self):
        if self.customer.reservation and self.customer.reservation_id:
            await self.update_parking(-1)
            await self.end_reservation()

        if self.parking.used_spot == self.parking.total_spot:
            await self.send(json.dumps({'message': 'Parking is already Full'}))
            return

        if self.customer.reservation_id and self.customer.reservation==False:
            await self.send(json.dumps({'message': 'You have already parked your car'}))
            return

        # if await self.get_balance() < self.parking.fee:
        #     await self.send(json.dumps({'message': 'Please recharge your account'}))
        #     return

        await self.update_parking(1)
        await self.channel_layer.group_send(self.parking_group_name, {
            'type': 'parking_update',
            'used_spot': self.parking.used_spot,
            'total_spot': self.parking.total_spot
        })
        await self.send(json.dumps({'value':'Parked'}))

        await self.make_reservation()

    async def release(self):
        if self.customer.reservation_id is None:
            await self.send(json.dumps({'message': 'You have not reserved any space'}))
            return

        # if self.parking.used_spot == 0:
        #     await self.send(json.dumps({'message': 'Parking is already empty'}))
        #     return

        await self.update_parking(-1)
        await self.channel_layer.group_send(self.parking_group_name, {
            'type': 'parking_update',
            'used_spot': self.parking.used_spot,
            'total_spot': self.parking.total_spot
        })

        await self.send(json.dumps({'value':'Reserve'}))

        await self.end_reservation()

    async def parking_update(self, data):
        await self.send(json.dumps({
            'used_spot': data['used_spot'],
            'total_spot': data['total_spot']
        }))

    @database_sync_to_async
    def get_parking(self):
        return ParkingLocation.objects.get(id=self.parking_id)

    @database_sync_to_async
    def get_customer(self):
        return Customer.objects.get(vehicle_id=self.vehicle_id)

    @database_sync_to_async
    def get_balance(self):
        return self.customer.user.balance

    @database_sync_to_async
    def update_parking(self, increment):
        ParkingLocation.objects.filter(id=self.parking_id).update(
            used_spot=models.F('used_spot') + increment
        )
        self.parking = ParkingLocation.objects.get(id=self.parking_id)

    @database_sync_to_async
    def make_reservation(self, reserv=False):
        with transaction.atomic():
            reservation = Reservation.objects.create(
                user=self.customer.user,
                parking=self.parking,
                reservation=reserv,
                start_time=timezone.now(),
                end_time=None,
                total_amount=None
            )
            reservation.save()
            Customer.objects.filter(id=self.customer.id).update(
                reservation_id=reservation.id,
                reservation=reserv
            )
            self.customer = Customer.objects.get(vehicle_id=self.vehicle_id)

    @database_sync_to_async
    def end_reservation(self):
        with transaction.atomic():
            reservation = Reservation.objects.select_for_update().get(id=self.customer.reservation_id)
            reservation.end_time = timezone.now()

            time_difference = reservation.end_time - reservation.start_time
            minute_difference = time_difference.total_seconds() / 60
            amount_per_minute = self.parking.fee / 60

            if self.customer.reservation:
                total_amount = (amount_per_minute * Decimal(minute_difference)) / 2
            else:
                total_amount = amount_per_minute * Decimal(minute_difference)

            reservation.total_amount = total_amount
            reservation.save()

            Customer.objects.filter(id=self.customer.id).update(
                reservation_id=None,
                reservation=False
            )
            self.customer = Customer.objects.get(vehicle_id=self.vehicle_id)

            UserModel.objects.filter(id=self.customer.user.id).update(
                balance=models.F('balance') - total_amount
            )

            UserModel.objects.filter(id=self.parking.user.id).update(
                balance=models.F('balance') + (total_amount * Decimal(0.9))
            )

            # payment = Payment.objects.create(
            #     from_user=f'{self.customer.user.first_name} {self.customer.user.last_name}',
            #     to_user=f'{self.parking.user.first_name} {self.parking.user.last_name}',
            #     amount=total_amount
            # )
            payment = Payment.objects.create(
                from_user   = self.customer.user.id,
                to_user     = self.parking.user.id,
                amount      = total_amount
            )
            payment.save()

