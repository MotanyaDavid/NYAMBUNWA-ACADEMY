# ============================================
# NYAMBUNWA ACADEMY BACKEND
# database.py - Database Setup & Operations
# ============================================

import sqlite3
import os
from datetime import datetime
from config import Config

# Map submission types to table names
TABLE_MAP = {
    'contacts': 'contacts',
    'admissions': 'admissions',
    'careers': 'careers'
}

def get_db():
    """Get database connection."""
    conn = sqlite3.connect(Config.DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Create all tables if they don't exist."""
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            subject TEXT,
            message TEXT NOT NULL,
            status TEXT DEFAULT 'New',
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS admissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            parent_name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            child_name TEXT NOT NULL,
            child_dob TEXT,
            grade_applying TEXT NOT NULL,
            current_school TEXT,
            message TEXT,
            status TEXT DEFAULT 'New',
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS careers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            position_applying TEXT,
            cover_letter TEXT NOT NULL,
            cv_filename TEXT,
            status TEXT DEFAULT 'New',
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS newsletters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_active INTEGER DEFAULT 1
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS replies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            submission_type TEXT NOT NULL,
            submission_id INTEGER NOT NULL,
            recipient_email TEXT NOT NULL,
            subject TEXT NOT NULL,
            body TEXT NOT NULL,
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()
    print("Database initialized successfully!")


def get_table_name(submission_type):
    """Get the correct table name for a submission type."""
    return TABLE_MAP.get(submission_type, submission_type)


def save_contact(name, email, phone, subject, message):
    """Save a contact form submission."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO contacts (name, email, phone, subject, message)
        VALUES (?, ?, ?, ?, ?)
    ''', (name, email, phone, subject, message))
    submission_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return submission_id

def save_admission(parent_name, email, phone, child_name, child_dob, grade_applying, current_school, message):
    """Save an admissions inquiry."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO admissions (parent_name, email, phone, child_name, child_dob, grade_applying, current_school, message)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (parent_name, email, phone, child_name, child_dob, grade_applying, current_school, message))
    submission_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return submission_id

def save_career(name, email, phone, position_applying, cover_letter, cv_filename):
    """Save a career application."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO careers (name, email, phone, position_applying, cover_letter, cv_filename)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (name, email, phone, position_applying, cover_letter, cv_filename))
    submission_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return submission_id

def save_newsletter(email):
    """Save a newsletter subscription."""
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO newsletters (email) VALUES (?)', (email,))
        conn.commit()
        conn.close()
        return True
    except sqlite3.IntegrityError:
        conn.close()
        return False

def save_reply(submission_type, submission_id, recipient_email, subject, body):
    """Log a reply sent to a user."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO replies (submission_type, submission_id, recipient_email, subject, body)
        VALUES (?, ?, ?, ?, ?)
    ''', (submission_type, submission_id, recipient_email, subject, body))
    conn.commit()
    conn.close()

def update_status(submission_type, submission_id, status, notes=None):
    """Update the status and optional notes of a submission."""
    conn = get_db()
    cursor = conn.cursor()
    table = get_table_name(submission_type)
    
    if notes:
        cursor.execute(f'''
            UPDATE {table} SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (status, notes, submission_id))
    else:
        cursor.execute(f'''
            UPDATE {table} SET status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (status, submission_id))
    
    conn.commit()
    conn.close()

def get_all_submissions(submission_type, status_filter=None):
    """Get all submissions of a given type, optionally filtered by status."""
    conn = get_db()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    table = get_table_name(submission_type)
    
    if status_filter and status_filter != 'All':
        cursor.execute(f'SELECT * FROM {table} WHERE status = ? ORDER BY created_at DESC', (status_filter,))
    else:
        cursor.execute(f'SELECT * FROM {table} ORDER BY created_at DESC')
    
    results = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return results

def get_submission(submission_type, submission_id):
    """Get a single submission by ID."""
    conn = get_db()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    table = get_table_name(submission_type)
    
    cursor.execute(f'SELECT * FROM {table} WHERE id = ?', (submission_id,))
    result = cursor.fetchone()
    conn.close()
    return dict(result) if result else None

def get_replies_for_submission(submission_type, submission_id):
    """Get all replies for a specific submission."""
    conn = get_db()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM replies 
        WHERE submission_type = ? AND submission_id = ?
        ORDER BY sent_at DESC
    ''', (submission_type, submission_id))
    
    results = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return results

def get_stats():
    """Get dashboard statistics."""
    conn = get_db()
    cursor = conn.cursor()
    
    stats = {}
    
    for table in ['contacts', 'admissions', 'careers']:
        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        stats[table + '_total'] = cursor.fetchone()[0]
        
        cursor.execute(f"SELECT COUNT(*) FROM {table} WHERE status = 'New'")
        stats[table + '_new'] = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM newsletters WHERE is_active = 1")
    stats['newsletter_subscribers'] = cursor.fetchone()[0]
    
    conn.close()
    return stats

if __name__ == '__main__':
    init_db()