from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,AllowAny
import requests
import json


# class KhaltiVerification(APIView):
#     permission_classes = [IsAuthenticated]
#     def get(self,request):
#         pidx = request.GET.get('pidx','')
#         return 0

LIVE_SECRET_KEY='f72317fd1e834f389c6ff25eaabd35d8'


def KhaltiInitiate(amount,name,email,phone):

    url = 'https://a.khalti.com/api/v2/epayment/initiate/'  #khalti sandbox for top up initiation

    headers = {
        'Authorization': f'Key {LIVE_SECRET_KEY}',
        'Content-Type': 'application/json',
    }#khalti header with khalti live_secret_key

    payload = json.dumps({
        "return_url": "http://localhost:5173/return_url",
        "website_url": "http://localhost:8000/",
        "amount": amount,
        "purchase_order_id": "Order01",
        "purchase_order_name": "TopUp",
        "customer_info": {
        "name": name,
        "email": email,
        "phone": phone
        }
    })
    response = requests.post(url,headers=headers,data=payload)#make request to khalti lookup endpoint
    print(response.json())

    return response.json()

def KhaltiVerification(pidx):

    url = 'https://a.khalti.com/api/v2/epayment/lookup/'    #khalti snadbox for verification

    headers = {
        'Authorization': f'Key {LIVE_SECRET_KEY}',
        'Content-Type': 'application/json',
    }#khalti header with khalti live_secret_key

    payload = json.dumps({
        "pidx":pidx
    })

    response = requests.post(url,headers=headers,data=payload)#make request to khalti lookup endpoint
    # print(response.json())

    try:
        response.raise_for_status() #Raise response for HTTP errors
        data = response.json()   #decode data from response
        if data['status']=='Completed':
            # print(data)
            return data
        else:
            return False
    
    except requests.exceptions.HTTPError as e:
        return False
    
    # if data.status=='Completed':
    #     return True
    # else:
    #     return False