# Maria Havens POS - Local Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Git (for cloning)
- Virtual environment (recommended)

### Installation Steps

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd maria-havens-pos
```

2. **Create virtual environment (recommended):**
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Set up the database:**
```bash
python manage.py migrate
```

5. **Create superuser:**
```bash
python create_superuser.py
```
- Email: jabezmageto78@gmail.com
- Password: lokeshen@58

6. **Load sample data:**
```bash
python create_sample_data.py
```

7. **Start the development server:**
```bash
python manage.py runserver
```

## 🌐 Access Points

- **API Base URL:** http://127.0.0.1:8000/
- **Admin Panel:** http://127.0.0.1:8000/admin/
- **API Authentication:** POST to `/api/auth/login/`

## 📡 Available API Endpoints

### Authentication
- `POST /api/auth/login/` - Get authentication token

### Core APIs
- `GET/POST/PUT/DELETE /menu/api/items/` - Menu items
- `GET/POST/PUT/DELETE /guests/api/` - Hotel guests
- `GET/POST/PUT/DELETE /orders/api/orders/` - Orders management
- `GET/POST/PUT/DELETE /payments/api/` - Payment processing
- `GET /reports/api/sales/` - Sales reports
- `GET /reports/api/payments/` - Payment reports

## 🧪 Testing

Run the API test suite:
```bash
python test_api.py
```

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env` file in the root directory:
```
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
```

### Sample API Usage
```python
import requests

# Login
response = requests.post('http://127.0.0.1:8000/api/auth/login/', {
    'username': 'jabezmageto78@gmail.com',
    'password': 'lokeshen@58'
})
token = response.json()['token']

# Use API with token
headers = {'Authorization': f'Token {token}'}
response = requests.get('http://127.0.0.1:8000/menu/api/items/', headers=headers)
```

## 📦 Project Structure
```
maria-havens-pos/
├── backend/           # Django project settings
├── menu/             # Menu items app
├── orders/           # Orders management app
├── guests/           # Hotel guests app
├── payments/         # Payment processing app
├── reports/          # Reporting app
├── manage.py         # Django management script
├── requirements.txt  # Python dependencies
└── db.sqlite3       # SQLite database (dev)
```

## 🛠️ Development Notes

- Uses SQLite for development (easy setup)
- Token-based authentication
- CORS enabled for frontend integration
- Admin panel available for data management
- Sample data included for testing