#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Setup Django
django.setup()

from django.contrib.auth.models import User

# Create superuser
username = 'jabezmageto78@gmail.com'
password = 'lokeshen@58'

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(
        username=username,
        email=username,
        password=password
    )
    print(f"Superuser '{username}' created successfully!")
else:
    print(f"Superuser '{username}' already exists!")