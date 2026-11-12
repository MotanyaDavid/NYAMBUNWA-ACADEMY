# ============================================
# NYAMBUNWA ACADEMY BACKEND
# config.py - Configuration Settings
# ============================================

import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'fallback-secret-key')
    DATABASE = os.path.join(os.path.dirname(__file__), 'nyambunwa.db')
    
    ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
    ADMIN_PASSWORD_HASH = os.environ.get('ADMIN_PASSWORD_HASH', '')
    
    # Email settings
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME', '')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD', '')
    
    SCHOOL_NAME = 'Nyambunwa Academy'
    SCHOOL_EMAIL = os.environ.get('SCHOOL_EMAIL', '')
    SCHOOL_PHONE = '0757 862 075'