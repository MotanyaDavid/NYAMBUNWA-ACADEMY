# ============================================
# NYAMBUNWA ACADEMY BACKEND
# config.py - Configuration Settings
# ============================================

import os

class Config:
    # Secret key for session management (CHANGE THIS in production)
    SECRET_KEY = 'nyambunwa-academy-secret-key-change-this-2025'
    
    # Database
    DATABASE = os.path.join(os.path.dirname(__file__), 'nyambunwa.db')
    
    # Admin credentials (CHANGE THESE in production)
    ADMIN_USERNAME = 'Motanya'
    ADMIN_PASSWORD = 'Nyambunwa@2025!'
    
    # Email settings for notifications (using Gmail)
    # Enable "App Passwords" in your Google Account if using Gmail
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'davidmotanya5@gmail.com'  # CHANGE THIS
    MAIL_PASSWORD = 'Allblacks@1723'        # CHANGE THIS
    
    # School info
    SCHOOL_NAME = 'Nyambunwa Academy'
    SCHOOL_EMAIL = 'nyambunwaacademy@gmail.com'
    SCHOOL_PHONE = '+254 757 862 075'