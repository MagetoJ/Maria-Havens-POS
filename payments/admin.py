from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'amount', 'method', 'status', 'created_at']
    list_filter = ['method', 'status', 'created_at']
    search_fields = ['transaction_id', 'order__customer_name']
    ordering = ['-created_at']
