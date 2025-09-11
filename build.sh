#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Convert static asset files
python manage.py collectstatic --no-input

# Apply any outstanding database migrations
python manage.py migrate

# Create superuser if it doesn't exist
echo "from django.contrib.auth.models import User; User.objects.filter(email='jabezmageto78@gmail.com').exists() or User.objects.create_superuser('jabezmageto78@gmail.com', 'jabezmageto78@gmail.com', 'lokeshen@58')" | python manage.py shell

# Load sample data
python create_sample_data.py