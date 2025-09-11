from rest_framework import serializers
from .models import Order, OrderItem
from menu.serializers import MenuItemSerializer
from guests.serializers import GuestSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_details = MenuItemSerializer(source='menu_item', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'menu_item_details', 'name', 'price', 'quantity', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    guest_details = GuestSerializer(source='guest', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'room_number', 'table_number', 'customer_name', 'guest', 'guest_details',
            'items', 'subtotal', 'tax', 'total', 'status', 'type', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class CreateOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    
    class Meta:
        model = Order
        fields = [
            'room_number', 'table_number', 'customer_name', 'guest',
            'items', 'subtotal', 'tax', 'total', 'status', 'type', 'notes'
        ]
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        
        return order