# 🏨 Maria Havens POS System

A comprehensive Point of Sale system designed for hotels and restaurants with room service capabilities.

## 🚀 Features

- **Menu Management**: Full CRUD operations for menu items with categories
- **Guest Management**: Hotel guest registration and room assignments
- **Order Processing**: Complete order lifecycle with status tracking
- **Payment Processing**: Multiple payment methods (cash, card, room charge, mobile)
- **Reporting**: Sales and payment analytics with date filtering
- **Authentication**: Token-based API authentication
- **Admin Panel**: Django admin interface for data management

## 🛠️ Tech Stack

- **Backend**: Django 5.0 + Django REST Framework
- **Database**: PostgreSQL (production) / SQLite (development)
- **Authentication**: Token-based authentication
- **Deployment**: Render, Railway, or Heroku compatible

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login/` - Get authentication token

### Core APIs
- **Menu**: `/menu/api/items/` - Menu items management
- **Guests**: `/guests/api/` - Guest management
- **Orders**: `/orders/api/orders/` - Order processing
- **Payments**: `/payments/api/` - Payment handling
- **Reports**: `/reports/api/sales/` & `/reports/api/payments/` - Analytics

## 🚀 Quick Deploy

### Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Fork this repository
2. Connect to Render
3. Use the `render.yaml` configuration
4. Set environment variables:
   - `SECRET_KEY` (auto-generated)
   - `DATABASE_URL` (auto-configured)

### Local Development

See [LOCAL_DEPLOYMENT.md](LOCAL_DEPLOYMENT.md) for detailed setup instructions.

```bash
# Quick start
git clone <your-repo-url>
cd maria-havens-pos
pip install -r requirements.txt
python manage.py migrate
python create_superuser.py
python manage.py runserver
```

## 🔐 Default Credentials

- **Email**: jabezmageto78@gmail.com
- **Password**: lokeshen@58

## 📖 API Documentation

Detailed API documentation is available in [API_README.md](API_README.md)

## 🧪 Testing

Run the included test suite:
```bash
python test_api.py
```

## 📂 Project Structure

```
maria-havens-pos/
├── backend/           # Django settings
├── menu/             # Menu management
├── orders/           # Order processing  
├── guests/           # Guest management
├── payments/         # Payment processing
├── reports/          # Analytics & reporting
├── requirements.txt  # Dependencies
├── render.yaml      # Render deployment config
└── build.sh         # Build script
```

## 🌟 Sample Data

The system includes sample data for testing:
- 6 menu items across different categories
- 3 hotel guests with room assignments
- 2 sample orders with payments
- Reporting data for analytics testing

## 📞 Support

For issues and questions, please create an issue in this repository.

## 📄 License

This project is licensed under the MIT License.