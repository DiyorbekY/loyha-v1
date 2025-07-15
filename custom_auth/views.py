# import json
# import random
# import requests
#
# from django.core.cache import cache
# from django.contrib.auth import get_user_model
# from django.conf import settings
#
# from rest_framework import status, viewsets
# from rest_framework.response import Response
# from rest_framework_simplejwt.tokens import RefreshToken
#
# from .serializer import SMSSerializer, VerifySMSSerializer
#
# User = get_user_model()
# SMS_KEY = settings.SMS_KEY
#
#
# class SMSLoginViewSet(viewsets.ViewSet):
#
#     def send_sms(self, request):
#         serializer = SMSSerializer(data=request.data)
#         if serializer.is_valid():
#             phone_number = serializer.validated_data['phone_number'].strip()
#             verification_code = str(random.randint(100000, 999999))
#             print("Yuborilayotgan kod:", verification_code)
#
#             url = "https://messagebird-sms-gateway.p.rapidapi.com/sms"
#             headers = {
#                 "x-rapidapi-key": "b99aa1fcf4mshdff004bae87b535p1c411fjsncbe5b9f16189",
#                 "x-rapidapi-host": "messagebird-sms-gateway.p.rapidapi.com",
#                 "Content-Type": "application/x-www-form-urlencoded"
#             }
#             payload = {
#                 "messages": [
#                     {
#                         "from": "salom",
#                         "destinations": [{"to": phone_number}],
#                         "text": f"Your verification code is {verification_code}"
#                     }
#                 ]
#             }
#             # payload={"target":"+99894140074","estimate":True}
#             response = requests.post(url, data=payload, headers=headers)
#             print("Infobip javobi:", response.status_code)
#             print("Infobip xabari:", response.text)
#
#
#             if response.status_code == 200:
#                 cache.set(phone_number, verification_code, timeout=300)
#                 return Response({"message": "SMS yuborildi"}, status=status.HTTP_200_OK)
#
#             return Response({"message": "SMS yuborilmadi. Xatolik yuz berdi."}, status=response.status_code)
#
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#     def verify_sms(self, request):
#         serializer = VerifySMSSerializer(data=request.data)
#         if serializer.is_valid():
#             phone_number = serializer.validated_data['phone_number'].strip()
#             verification_code = serializer.validated_data['verification_code'].strip()
#             cached_code = cache.get(phone_number)
#
#             if verification_code == cached_code:
#                 user, created = User.objects.get_or_create(phone_number=phone_number)
#                 if created:
#                     user.save()
#
#                 refresh = RefreshToken.for_user(user)
#                 return Response({
#                     "refresh": str(refresh),
#                     "access": str(refresh.access_token)
#                 })
#
#             return Response({"message": "Noto'g'ri tasdiqlash kodi"}, status=status.HTTP_400_BAD_REQUEST)
#
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
