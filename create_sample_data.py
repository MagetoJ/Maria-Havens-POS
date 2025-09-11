#!/usr/bin/env python
import os
import sys
import django
from decimal import Decimal
from datetime import datetime, timedelta

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Setup Django
django.setup()

from menu.models import MenuItem
from guests.models import Guest
from orders.models import Order, OrderItem
from payments.models import Payment

# Create sample menu items
menu_items = [
    {"name": "Caesar Salad", "description": "Fresh romaine lettuce with caesar dressing", "price": Decimal("12.99"), "category": "Appetizers"},
    {"name": "Grilled Chicken", "description": "Herb-crusted grilled chicken breast", "price": Decimal("18.99"), "category": "Main Courses"},
    {"name": "Beef Burger", "description": "Juicy beef burger with fries", "price": Decimal("15.99"), "category": "Main Courses"},
    {"name": "Chocolate Cake", "description": "Rich chocolate layer cake", "price": Decimal("8.99"), "category": "Desserts"},
    {"name": "Coffee", "description": "Premium roasted coffee", "price": Decimal("3.99"), "category": "Beverages"},
    {"name": "Wine - Red", "description": "House red wine", "price": Decimal("7.99"), "category": "Beverages"},
]

for item_data in menu_items:
    MenuItem.objects.get_or_create(
        name=item_data["name"],
        defaults=item_data
    )

print("Sample menu items created!")

# Create sample guests
guests = [
    {"name": "John Smith", "room_number": "101", "email": "john@example.com", "phone": "+1234567890"},
    {"name": "Mary Johnson", "room_number": "205", "email": "mary@example.com", "phone": "+1234567891"},
    {"name": "David Brown", "room_number": "310", "email": "david@example.com", "phone": "+1234567892"},
]

for guest_data in guests:
    guest_data["check_in"] = datetime.now() - timedelta(days=1)
    guest_data["check_out"] = datetime.now() + timedelta(days=3)
    Guest.objects.get_or_create(
        room_number=guest_data["room_number"],
        defaults=guest_data
    )

print("Sample guests created!")

# Create sample orders
guest = Guest.objects.first()
chicken = MenuItem.objects.get(name="Grilled Chicken")
coffee = MenuItem.objects.get(name="Coffee")

order = Order.objects.create(
    room_number="101",
    customer_name="John Smith",
    guest=guest,
    subtotal=Decimal("22.98"),
    tax=Decimal("2.30"),
    total=Decimal("25.28"),
    status="preparing",
    type="room-service",
    notes="No onions please"
)

OrderItem.objects.create(
    order=order,
    menu_item=chicken,
    name=chicken.name,
    price=chicken.price,
    quantity=1,
    notes="Well done"
)

OrderItem.objects.create(
    order=order,
    menu_item=coffee,
    name=coffee.name,
    price=coffee.price,
    quantity=1
)

print("Sample order created!")

# Create sample payment
Payment.objects.create(
    order=order,
    amount=order.total,
    method="room-charge",
    status="completed",
    transaction_id="TXN123456"
)

print("Sample payment created!")
print("Sample data setup complete!")