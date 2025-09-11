# Maria Havens POS Backend API

A Django REST API backend for a Point of Sale system designed for hotels and restaurants with room service capabilities.

## Features

- **Menu Management**: CRUD operations for menu items with categories, pricing, and availability
- **Guest Management**: Hotel guest information with room assignments
- **Order Processing**: Complete order lifecycle from creation to payment
- **Payment Processing**: Multiple payment methods including room charges
- **Reporting**: Sales and payment analytics with date filtering
- **Admin Interface**: Django admin for easy management

## Authentication

The API uses Token-based authentication. Include the token in the Authorization header:

```
Authorization: Token your_token_here
```

### Getting a Token

POST to `/api/auth/login/` with username and password:

```json
{
    "username": "jabezmageto78@gmail.com",
    "password": "lokeshen@58"
}
```

## API Endpoints

### Menu Items
- `GET /menu/api/items/` - List all menu items
- `POST /menu/api/items/` - Create a new menu item
- `GET /menu/api/items/{id}/` - Retrieve a specific menu item
- `PUT /menu/api/items/{id}/` - Update a menu item
- `DELETE /menu/api/items/{id}/` - Delete a menu item

#### Filters:
- `?category=Main Courses` - Filter by category
- `?available=true` - Filter by availability
- `?search=chicken` - Search in name, description, category

### Guests
- `GET /guests/api/` - List all guests
- `POST /guests/api/` - Create a new guest
- `GET /guests/api/{id}/` - Retrieve a specific guest
- `PUT /guests/api/{id}/` - Update a guest
- `DELETE /guests/api/{id}/` - Delete a guest

#### Filters:
- `?room_number=101` - Filter by room number
- `?search=john` - Search in name, room number, email, phone

### Orders
- `GET /orders/api/orders/` - List all orders
- `POST /orders/api/orders/` - Create a new order
- `GET /orders/api/orders/{id}/` - Retrieve a specific order
- `PUT /orders/api/orders/{id}/` - Update an order
- `DELETE /orders/api/orders/{id}/` - Delete an order
- `PATCH /orders/api/orders/{id}/update_status/` - Update order status

#### Filters:
- `?status=pending` - Filter by status (pending, preparing, ready, delivered, paid)
- `?type=room-service` - Filter by type (room-service, restaurant, bar)
- `?room_number=101` - Filter by room number
- `?search=john` - Search in customer name, room number, table number

### Order Items
- `GET /orders/api/order-items/` - List all order items
- `POST /orders/api/order-items/` - Create a new order item
- `GET /orders/api/order-items/{id}/` - Retrieve a specific order item
- `PUT /orders/api/order-items/{id}/` - Update an order item
- `DELETE /orders/api/order-items/{id}/` - Delete an order item

### Payments
- `GET /payments/api/` - List all payments
- `POST /payments/api/` - Create a new payment
- `GET /payments/api/{id}/` - Retrieve a specific payment
- `PUT /payments/api/{id}/` - Update a payment
- `DELETE /payments/api/{id}/` - Delete a payment
- `PATCH /payments/api/{id}/process_payment/` - Process payment

#### Filters:
- `?status=completed` - Filter by status (pending, completed, failed)
- `?method=cash` - Filter by method (cash, credit, debit, room-charge)
- `?order={order_id}` - Filter by order

### Reports
- `GET /reports/api/sales/` - Sales report with analytics
- `GET /reports/api/payments/` - Payment report with breakdown

#### Query Parameters:
- `?start_date=2024-01-01` - Start date for report
- `?end_date=2024-12-31` - End date for report

## Sample API Calls

### Create an Order
```json
POST /orders/api/orders/
{
    "room_number": "101",
    "customer_name": "John Smith",
    "guest": "guest_id_here",
    "items": [
        {
            "menu_item": "menu_item_id",
            "name": "Grilled Chicken",
            "price": "18.99",
            "quantity": 1,
            "notes": "Well done"
        }
    ],
    "subtotal": "18.99",
    "tax": "1.90",
    "total": "20.89",
    "status": "pending",
    "type": "room-service",
    "notes": "Deliver to room"
}
```

### Process Payment
```json
PATCH /payments/api/{payment_id}/process_payment/
{
    "status": "completed",
    "transaction_id": "TXN123456"
}
```

## Admin Access

- URL: `/admin/`
- Username: `jabezmageto78@gmail.com`
- Password: `lokeshen@58`

## Installation & Setup

1. Install dependencies:
```bash
pip install django djangorestframework django-cors-headers django-filter pillow python-decouple
```

2. Run migrations:
```bash
python manage.py migrate
```

3. Create superuser:
```bash
python create_superuser.py
```

4. Create sample data:
```bash
python create_sample_data.py
```

5. Start server:
```bash
python manage.py runserver
```

## MySQL Configuration

To use MySQL instead of SQLite, update `backend/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'maria_havens_pos',
        'USER': 'root',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'sql_mode': 'traditional',
        }
    }
}
```

And install MySQL client:
```bash
pip install mysqlclient
```

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)

## Error Handling

The API returns standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error responses include a message field:
```json
{
    "error": "Description of the error"
}
```