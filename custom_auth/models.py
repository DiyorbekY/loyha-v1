# from django.db import models
# from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin
# from django.utils import timezone
#
#
# class CustomUserManager(BaseUserManager):
#
#     def create_user(self,phone_number,password=None,**extra_fields):
#         if not phone_number:
#             raise ValueError('Telefon raqam kiritilishi kerak')
#         user=self.model(phone_number=phone_number,**extra_fields)
#         user.set_password(password)
#         user.save(using=self._db)
#         return user
#     def create_superuser(self,phone_number,password=None,**extra_fields):
#         extra_fields.setdefault('is_staff',True)
#         extra_fields.setdefault('is_superuser',True)
#         if extra_fields.get('is_staff') is None:
#             raise ValueError('Superuser is_staff=True bo\'lishi kerak')
#         if extra_fields.get('is_superuser') is None:
#             raise ValueError('Superuser is_superuser=True bo\'lishi kerak')
#         return self.create_user(phone_number,password,**extra_fields)
#
#
# class CustomUser(AbstractBaseUser,PermissionsMixin):
#     phone_number=models.CharField(max_length=15,unique=True,null=True)
#     date_joined=models.DateTimeField(default=timezone.now)
#     is_active=models.BooleanField(default=True)
#     is_staff=models.BooleanField(default=False)
#
#     objects=CustomUserManager()
#
#     USERNAME_FIELD='phone_number'
#     REQUIRED_FIELDS = []
#
#     def __str__(self):
#         return self.phone_number


