# ============================================
# NYAMBUNWA ACADEMY BACKEND
# config.py - Configuration Settings
# ============================================

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Secret key for session management
    SECRET_KEY = os.environ.get('SECRET_KEY', os.urandom(24).hex())
    
    # Database
    DATABASE = os.path.join(os.path.dirname(__file__), 'nyambunwa.db')
    
    # Admin credentials
    ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
    ADMIN_PASSWORD_HASH = os.environ.get('ADMIN_PASSWORD_HASH', 'pbkdf2:sha256:1000000$ODu80Flh99790jCq$97a149162aa585495626efc6425aeab4ade13384b3d989043a338634adc83c8eded9fd4a7d97f56ad1')
    
    # Email settings
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME', '')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD', '')
    
    # School info
    SCHOOL_NAME = os.environ.get('SCHOOL_NAME', 'Nyambunwa Academy')
    SCHOOL_EMAIL = os.environ.get('SCHOOL_EMAIL', 'nyambunwaacademy@gmail.com')
    SCHOOL_PHONE = os.environ.get('SCHOOL_PHONE', '+254 757 862 075')