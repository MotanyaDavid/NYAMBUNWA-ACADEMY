# ============================================
# NYAMBUNWA ACADEMY
# backup.py - Database Backup Script
# ============================================
# Usage: python backup.py
# Run daily via Task Scheduler (Windows) or cron (Linux/Mac)

import shutil
import os
from datetime import datetime

BACKUP_FOLDER = os.path.join(os.path.dirname(__file__), 'backups')
DB_PATH = os.path.join(os.path.dirname(__file__), 'nyambunwa.db')

def create_backup():
    """Create a timestamped backup of the database."""
    
    # Create backups folder if it doesn't exist
    if not os.path.exists(BACKUP_FOLDER):
        os.makedirs(BACKUP_FOLDER)
    
    # Generate backup filename with timestamp
    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    backup_filename = f'nyambunwa_backup_{timestamp}.db'
    backup_path = os.path.join(BACKUP_FOLDER, backup_filename)
    
    # Copy database file
    if os.path.exists(DB_PATH):
        shutil.copy2(DB_PATH, backup_path)
        print(f"✅ Backup created: {backup_filename}")
        
        # Remove old backups (keep only last 30)
        backups = sorted([f for f in os.listdir(BACKUP_FOLDER) if f.endswith('.db')])
        while len(backups) > 30:
            oldest = backups.pop(0)
            os.remove(os.path.join(BACKUP_FOLDER, oldest))
            print(f"🗑️ Removed old backup: {oldest}")
    else:
        print("❌ Database file not found. No backup created.")

if __name__ == '__main__':
    create_backup()