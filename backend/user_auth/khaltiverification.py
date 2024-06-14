from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,AllowAny
import requests


# class KhaltiVerification(APIView):
#     permission_classes = [IsAuthenticated]
#     def get(self,request):
#         pidx = request.GET.get('pidx','')
#         return 0

LIVE_SECRET_KEY='f72317fd1e834f389c6ff25eaabd35d8'

def KhaltiVerification(pidx):

    url = 'https://a.khalti.com/api/v2/epayment/lookup/'    #khalti snadbox url

    headers = {
        'Authorization': f'Key {LIVE_SECRET_KEY}',
        'Content-Type': 'application/json',
    }#khalti header with khalti live_secret_key

    response = requests.post(url,headers,{
        'pidx'  : pidx
    })#make request to khalti lookup endpoint

    try:
        response.raise_for_status() #Raise response for HTTP errors
        data = response.json()   #decode data from response
    
    except requests.exceptions.HTTPError as e:
        return Response(f'HTTP Error {e}')
    
    if data.status=='Completed':
        return True
    else:
        return False