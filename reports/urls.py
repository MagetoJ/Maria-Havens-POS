from django.urls import path
from .views import sales_report, payment_report

urlpatterns = [
    path('api/sales/', sales_report, name='sales_report'),
    path('api/payments/', payment_report, name='payment_report'),
]