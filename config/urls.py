from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

from drf_yasg import openapi
from drf_yasg.generators import OpenAPISchemaGenerator
from drf_yasg.views import get_schema_view

from rest_framework import permissions


from billing.views import CreateChargeView


class JWTSchemaGenerator(OpenAPISchemaGenerator):
    def get_security_definitions(self):
        security_definitions = super().get_security_definitions()
        security_definitions['Bearer'] = {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
        return security_definitions


schema_view = get_schema_view(
    openapi.Info(
        title="Online Shop API",
        default_version='v1',
        description="Django DRF asosida tuzilgan E-commerce platforma API",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="yoldoshevd979@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
    generator_class=JWTSchemaGenerator,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/v1/account/', include('account.urls')),
    path('api/v1/product/', include('product.urls')),
    path('api/v1/order/', include('order.urls')),
    # path('api/v1/sms-auth/',include('custom_auth.urls')),

    path('api/v1/auth/', include('djoser.urls')),
    path('api/v1/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/v1/pay/',CreateChargeView.as_view(),name='create-charge'),

    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
# # if settings.DEBUG:
# #     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# #     urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
# from django.contrib import admin
# from django.urls import path, re_path, include
# from django.conf import settings
# from django.conf.urls.static import static
# from django.views.generic import TemplateView
# from billing import views
# from billing.views import CreateChargeView
# from drf_yasg import openapi
# from drf_yasg.generators import OpenAPISchemaGenerator
# from drf_yasg.views import get_schema_view
# from rest_framework import permissions
# from product.frontend import *
#
#
# class JWTSchemaGenerator(OpenAPISchemaGenerator):
#     def get_security_definitions(self):
#         security_definitions = super().get_security_definitions()
#         security_definitions['Bearer'] = {
#             'type': 'apiKey',
#             'name': 'Authorization',
#             'in': 'header'
#         }
#         return security_definitions
#
#
# schema_view = get_schema_view(
#     openapi.Info(
#         title="Online Shop API",
#         default_version='v1',
#         description="Django DRF asosida tuzilgan E-commerce platforma API",
#         terms_of_service="https://www.google.com/policies/terms/",
#         contact=openapi.Contact(email="yoldoshevd979@gmail.com"),
#         license=openapi.License(name="BSD License"),
#     ),
#     public=True,
#     permission_classes=[permissions.AllowAny],
#     generator_class=JWTSchemaGenerator,
# )
#
# urlpatterns = [
#     # Admin
#     path('admin/', admin.site.urls),
#
#     # API URLs
#     path('api/v1/account/', include('account.urls')),
#     path('api/v1/product/', include('product.urls')),
#     path('api/v1/order/', include('order.urls')),
#     path('api/v1/pay/', CreateChargeView.as_view(), name='create-charge'),
#
#     # Swagger/API Documentation
#     re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
#     path('api-docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
#     path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
#
#     # Frontend URLs (Templates)
#     path('', HomeView.as_view(), name='home'),
#     path('products/', ProductListView.as_view(), name='products'),
#     path('products/<int:pk>/', ProductDetailView.as_view(), name='product_detail'),
#     path('category/<int:pk>/', CategoryProductsView.as_view(), name='category_products'),
#     path('brand/<int:pk>/', BrandProductsView.as_view(), name='brand_products'),
#     path('search/', ProductSearchView.as_view(), name='product_search'),
#     path('cart/', CartView.as_view(), name='cart'),
#     path('wishlist/', WishlistView.as_view(), name='wishlist'),
#     path('checkout/', CheckoutView.as_view(), name='checkout'),
#     path('flash-sales/', FlashSalesView.as_view(), name='flash_sales'),
#     path('categories/', CategoriesView.as_view(), name='categories'),
#     path('brands/', BrandsView.as_view(), name='brands'),
#     path('new-products/', NewProductsView.as_view(), name='new_products'),
#
#     # User account pages
#     path('login/', LoginView.as_view(), name='login'),
#     path('register/', RegisterView.as_view(), name='register'),
#     path('logout/', LogoutView.as_view(), name='logout'),
#     path('profile/', ProfileView.as_view(), name='profile'),
#     path('orders/', OrdersView.as_view(), name='orders'),
#
#     # Static pages
#     path('about/', TemplateView.as_view(template_name='pages/about.html'), name='about'),
#     path('contact/', TemplateView.as_view(template_name='pages/contact.html'), name='contact'),
#     path('delivery/', TemplateView.as_view(template_name='pages/delivery.html'), name='delivery'),
#     path('return-policy/', TemplateView.as_view(template_name='pages/return_policy.html'), name='return_policy'),
#
#     # AJAX endpoints
#     path('ajax/add-to-cart/', AddToCartView.as_view(), name='ajax_add_to_cart'),
#     path('ajax/add-to-wishlist/', AddToWishlistView.as_view(), name='ajax_add_to_wishlist'),
#     path('ajax/remove-from-cart/', RemoveFromCartView.as_view(), name='ajax_remove_from_cart'),
#     path('ajax/update-cart/', UpdateCartView.as_view(), name='ajax_update_cart'),
#     path('products/<int:product_id>/add-review/', AddReviewView.as_view(), name='add_review'),
# ]
#
# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
#     urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)