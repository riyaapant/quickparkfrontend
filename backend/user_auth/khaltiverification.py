from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework_simplejwt.tokens import RefreshToken


class KhaltiVerification(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        pidx = request.GET.get('pidx','')

        return 0