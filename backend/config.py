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
    ADMIN_USERNAME = 'admin'
    ADMIN_PASSWORD = 'Nyambunwa2025!'
    
    # Email settings for notifications (using Gmail)
    # Enable "App Passwords" in your Google Account if using Gmail
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'nyambunwa.academy@gmail.com'  # CHANGE THIS
    MAIL_PASSWORD = 'your-app-password-here'        # CHANGE THIS
    
    # School info
    SCHOOL_NAME = 'Nyambunwa Academy'
    SCHOOL_EMAIL = 'info@nyambunwaacademy.sc.ke'
    SCHOOL_PHONE = '+254 700 000 000'