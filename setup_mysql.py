#!/usr/bin/env python
"""
Script to configure Django for MySQL database
Run this after installing MySQL and creating the database
"""

import os
import sys
from pathlib import Path

def update_settings_for_mysql():
    """Update Django settings to use MySQL"""
    
    settings_path = Path(__file__).parent / 'backend' / 'settings.py'
    
    # Read current settings
    with open(settings_path, 'r') as f:
        content = f.read()
    
    # Replace SQLite configuration with MySQL
    old_db_config = """DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}"""
    
    new_db_config = """DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': config('DB_NAME', default='maria_havens_pos'),
        'USER': config('DB_USER', default='root'),
        'PASSWORD': config('DB_PASSWORD', default=''),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='3306'),
        'OPTIONS': {
            'sql_mode': 'traditional',
        }
    }
}"""
    
    # Also add back the config import if needed
    if 'from decouple import config' not in content:
        content = content.replace(
            'from pathlib import Path\nimport os',
            'from pathlib import Path\nimport os\nfrom decouple import config'
        )
    
    # Replace database configuration
    content = content.replace(old_db_config, new_db_config)
    
    # Write updated settings
    with open(settings_path, 'w') as f:
        f.write(content)
    
    print("✅ Settings updated for MySQL!")

def create_env_file():
    """Create .env file with MySQL configuration"""
    
    env_path = Path(__file__).parent / '.env'
    
    env_content = """# Database Configuration
DB_NAME=maria_havens_pos
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_HOST=localhost
DB_PORT=3306

# Django Configuration
DEBUG=True
SECRET_KEY=django-insecure-7$!19#datj9)h-nds3bh5mv2bwaio)8p2$7f0kdowwg61yza7=
"""
    
    with open(env_path, 'w') as f:
        f.write(env_content)
    
    print("✅ .env file created!")
    print("📝 Please update DB_PASSWORD in .env file with your MySQL password")

def create_mysql_database_script():
    """Create SQL script to set up MySQL database"""
    
    sql_script = """-- MySQL Database Setup for Maria Havens POS
-- Run these commands in MySQL command line or phpMyAdmin

-- Create database
CREATE DATABASE IF NOT EXISTS maria_havens_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional - you can use root)
-- CREATE USER 'pos_user'@'localhost' IDENTIFIED BY 'secure_password_here';

-- Grant privileges
-- GRANT ALL PRIVILEGES ON maria_havens_pos.* TO 'pos_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Use database
USE maria_havens_pos;

-- Show tables (after running Django migrations)
-- SHOW TABLES;
"""
    
    script_path = Path(__file__).parent / 'setup_mysql_database.sql'
    with open(script_path, 'w') as f:
        f.write(sql_script)
    
    print(f"✅ MySQL database script created: {script_path}")

def main():
    print("🔧 Setting up MySQL configuration for Maria Havens POS")
    print("=" * 50)
    
    print("\n1. Creating MySQL database script...")
    create_mysql_database_script()
    
    print("\n2. Creating .env file...")
    create_env_file()
    
    print("\n3. Updating Django settings...")
    update_settings_for_mysql()
    
    print("\n" + "=" * 50)
    print("✅ MySQL setup complete!")
    print("\n📋 Next steps:")
    print("1. Install MySQL server if not already installed")
    print("2. Install MySQL client: pip install mysqlclient")
    print("3. Run the SQL script: setup_mysql_database.sql")
    print("4. Update .env file with your MySQL password")
    print("5. Run migrations: python manage.py migrate")
    print("6. Create superuser: python create_superuser.py")
    print("7. Load sample data: python create_sample_data.py")

if __name__ == "__main__":
    main()