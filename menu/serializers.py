from rest_framework import serializers
from .models import MenuItem

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'price', 'category', 'available', 'image', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']