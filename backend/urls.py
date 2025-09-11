"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token
from django.http import JsonResponse
from django.shortcuts import render

def home_view(request):
    """Home page showing API overview"""
    return JsonResponse({
        'message': 'Maria Havens POS API',
        'version': '1.0',
        'status': 'running',
        'endpoints': {
            'admin': '/admin/',
            'authentication': '/api/auth/login/',
            'menu_items': '/api/menu/items/',
            'guests': '/api/guests/',
            'orders': '/api/orders/',
            'payments': '/api/payments/',
            'sales_report': '/api/reports/sales/',
            'payment_report': '/api/reports/payments/',
        },
        'credentials': {
            'admin_username': 'jabezmageto78@gmail.com',
            'admin_password': 'lokeshen@58'
        }
    })

urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('api/auth/login/', obtain_auth_token, name='api_token_auth'),
    path('api/menu/', include('menu.urls')),
    path('api/guests/', include('guests.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/reports/', include('reports.urls')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
