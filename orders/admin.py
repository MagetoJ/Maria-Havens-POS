from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['created_at']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer_name', 'type', 'status', 'total', 'created_at']
    list_filter = ['status', 'type', 'created_at']
    search_fields = ['customer_name', 'room_number', 'table_number']
    ordering = ['-created_at']
    inlines = [OrderItemInline]

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'name', 'quantity', 'price', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'order__customer_name']
    ordering = ['-created_at']
