from django.db import models
import uuid
from menu.models import MenuItem
from guests.models import Guest

class Order(models.Model):
    ORDER_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('preparing', 'Preparing'),
        ('ready', 'Ready'),
        ('delivered', 'Delivered'),
        ('paid', 'Paid'),
    ]
    
    ORDER_TYPE_CHOICES = [
        ('room-service', 'Room Service'),
        ('restaurant', 'Restaurant'),
        ('bar', 'Bar'),
    ]
    
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4, editable=False)
    room_number = models.CharField(max_length=20, blank=True, null=True)
    table_number = models.CharField(max_length=20, blank=True, null=True)
    customer_name = models.CharField(max_length=200, blank=True, null=True)
    guest = models.ForeignKey(Guest, on_delete=models.SET_NULL, blank=True, null=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending')
    type = models.CharField(max_length=20, choices=ORDER_TYPE_CHOICES)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'orders'
        ordering = ['-created_at']

    def __str__(self):
        return f"Order {self.id} - {self.customer_name or 'No Name'} - ${self.total}"

class OrderItem(models.Model):
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)  # Store name for historical purposes
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Store price for historical purposes
    quantity = models.PositiveIntegerField()
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'order_items'

    def __str__(self):
        return f"{self.quantity}x {self.name} - ${self.price}"
