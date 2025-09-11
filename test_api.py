#!/usr/bin/env python
"""
Simple API test script to verify the Django backend is working
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_authentication():
    """Test login and token authentication"""
    print("🔐 Testing authentication...")
    
    # Login to get token
    login_data = {
        "username": "jabezmageto78@gmail.com",
        "password": "lokeshen@58"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login/", data=login_data)
        if response.status_code == 200:
            token = response.json()['token']
            print(f"✅ Login successful! Token: {token[:20]}...")
            return token
        else:
            print(f"❌ Login failed: {response.status_code}")
            return None
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed. Make sure Django server is running on port 8000")
        return None

def test_menu_items(token):
    """Test menu items API"""
    print("\n🍽️ Testing menu items API...")
    
    headers = {'Authorization': f'Token {token}'}
    
    try:
        response = requests.get(f"{BASE_URL}/menu/api/items/", headers=headers)
        if response.status_code == 200:
            data = response.json()
            items = data.get('results', data) if isinstance(data, dict) else data
            print(f"✅ Retrieved {len(items)} menu items")
            if items:
                print(f"   First item: {items[0]['name']} - ${items[0]['price']}")
            return True
        else:
            print(f"❌ Failed to retrieve menu items: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_guests(token):
    """Test guests API"""
    print("\n🏨 Testing guests API...")
    
    headers = {'Authorization': f'Token {token}'}
    
    try:
        response = requests.get(f"{BASE_URL}/guests/api/", headers=headers)
        if response.status_code == 200:
            data = response.json()
            guests = data.get('results', data) if isinstance(data, dict) else data
            print(f"✅ Retrieved {len(guests)} guests")
            if guests:
                print(f"   First guest: {guests[0]['name']} - Room {guests[0]['room_number']}")
            return True
        else:
            print(f"❌ Failed to retrieve guests: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_orders(token):
    """Test orders API"""
    print("\n📋 Testing orders API...")
    
    headers = {'Authorization': f'Token {token}'}
    
    try:
        response = requests.get(f"{BASE_URL}/orders/api/orders/", headers=headers)
        if response.status_code == 200:
            data = response.json()
            orders = data.get('results', data) if isinstance(data, dict) else data
            print(f"✅ Retrieved {len(orders)} orders")
            if orders:
                print(f"   First order: {orders[0]['customer_name']} - ${orders[0]['total']} - {orders[0]['status']}")
            return True
        else:
            print(f"❌ Failed to retrieve orders: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_payments(token):
    """Test payments API"""
    print("\n💳 Testing payments API...")
    
    headers = {'Authorization': f'Token {token}'}
    
    try:
        response = requests.get(f"{BASE_URL}/payments/api/", headers=headers)
        if response.status_code == 200:
            data = response.json()
            payments = data.get('results', data) if isinstance(data, dict) else data
            print(f"✅ Retrieved {len(payments)} payments")
            if payments:
                print(f"   First payment: ${payments[0]['amount']} - {payments[0]['method']} - {payments[0]['status']}")
            return True
        else:
            print(f"❌ Failed to retrieve payments: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_reports(token):
    """Test reports API"""
    print("\n📊 Testing reports API...")
    
    headers = {'Authorization': f'Token {token}'}
    
    try:
        # Test sales report
        response = requests.get(f"{BASE_URL}/reports/api/sales/", headers=headers)
        if response.status_code == 200:
            report = response.json()
            print(f"✅ Sales report: ${report['summary']['total_revenue']} revenue, {report['summary']['total_orders']} orders")
            
            # Test payment report
            response = requests.get(f"{BASE_URL}/reports/api/payments/", headers=headers)
            if response.status_code == 200:
                report = response.json()
                print(f"✅ Payment report: ${report['total_payments']} total payments")
                return True
        
        print(f"❌ Failed to retrieve reports: {response.status_code}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("🧪 Maria Havens POS API Test")
    print("=" * 40)
    
    # Test authentication
    token = test_authentication()
    if not token:
        print("\n❌ Cannot proceed without authentication")
        return
    
    # Test all endpoints
    tests = [
        test_menu_items,
        test_guests,
        test_orders,
        test_payments,
        test_reports
    ]
    
    passed = 0
    for test in tests:
        if test(token):
            passed += 1
    
    print("\n" + "=" * 40)
    print(f"🎯 Test Results: {passed}/{len(tests)} passed")
    
    if passed == len(tests):
        print("✅ All tests passed! API is working correctly.")
    else:
        print("⚠️ Some tests failed. Check the output above.")

if __name__ == "__main__":
    main()