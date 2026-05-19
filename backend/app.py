# ============================================
# NYAMBUNWA ACADEMY BACKEND
# app.py - Main Flask Application
# ============================================

from flask import Flask, request, jsonify, render_template, session, redirect, url_for, make_response
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_wtf.csrf import CSRFProtect
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from datetime import datetime, timedelta
import os
import bleach
import logging
from logging.handlers import RotatingFileHandler

from config import Config
from database import (
    init_db, save_contact, save_admission, save_career, save_newsletter,
    save_reply, update_status, get_all_submissions, get_submission,
    get_replies_for_submission, get_stats, get_admin_by_username,
    update_admin_last_login, get_table_name
)

app = Flask(__name__)
app.secret_key = Config.SECRET_KEY

# CORS
allowed_origins = os.environ.get('ALLOWED_ORIGINS', 'http://localhost:5000,http://127.0.0.1:5000,http://localhost:8000,http://127.0.0.1:8000,http://localhost:3000,http://127.0.0.1:3000').split(',')
CORS(app, origins=allowed_origins)

# CSRF Protection
csrf = CSRFProtect(app)

# Rate Limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

# Initialize database
init_db()

# Session configuration
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)
app.config['SESSION_REFRESH_EACH_REQUEST'] = True

# Configure logging
log_dir = os.path.join(os.path.dirname(__file__), 'logs')
if not os.path.exists(log_dir):
    os.makedirs(log_dir)

file_handler = RotatingFileHandler(
    os.path.join(log_dir, 'nyambunwa.log'),
    maxBytes=1024 * 1024,
    backupCount=10
)
file_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s: %(message)s'))
file_handler.setLevel(logging.INFO)
app.logger.addHandler(file_handler)
app.logger.setLevel(logging.INFO)
app.logger.info('Nyambunwa Academy Backend started')

# ============================================
# HELPERS
# ============================================

ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}
MAX_FILE_SIZE = 5 * 1024 * 1024

def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_file_size(file_storage):
    """Check if file size is within limits."""
    file_storage.seek(0, os.SEEK_END)
    size = file_storage.tell()
    file_storage.seek(0)
    return size <= MAX_FILE_SIZE

def sanitize_input(text):
    """Remove dangerous HTML/scripts from user input."""
    if text is None:
        return None
    return bleach.clean(str(text), tags=[], strip=True)

def audit_log(action, details=''):
    """Log an admin action."""
    from database import log_audit
    username = session.get('admin_username', 'Unknown')
    ip = request.remote_addr
    log_audit(username, action, details, ip)

# ============================================
# DECORATORS
# ============================================

def login_required(f):
    """Decorator to protect admin routes with session timeout."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_logged_in' not in session:
            return redirect(url_for('login_page'))
        
        if 'last_activity' in session:
            last_activity = datetime.fromisoformat(session['last_activity'])
            if datetime.now() - last_activity > timedelta(minutes=30):
                session.clear()
                return redirect(url_for('login_page'))
        
        session['last_activity'] = datetime.now().isoformat()
        return f(*args, **kwargs)
    return decorated_function

# ============================================
# EMAIL HELPER
# ============================================

def send_email(to_email, subject, body):
    """Send an email using Gmail SMTP."""
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart

    try:
        msg = MIMEMultipart()
        msg['From'] = Config.MAIL_USERNAME
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        with smtplib.SMTP(Config.MAIL_SERVER, Config.MAIL_PORT) as server:
            server.starttls()
            server.login(Config.MAIL_USERNAME, Config.MAIL_PASSWORD)
            server.send_message(msg)

        print(f"Email sent to {to_email}")
        return True
    except Exception as e:
        print(f"Email failed: {e}")
        return False

def send_admin_notification(submission_type, data):
    """Send notification to admin when a new submission arrives."""
    subject = f"New {submission_type.capitalize()} Submission - {Config.SCHOOL_NAME}"
    body = f"A new {submission_type} form has been submitted.\n\n"
    for key, value in data.items():
        body += f"{key.replace('_', ' ').title()}: {value}\n"
    body += f"\nView in dashboard: http://localhost:5000/admin/dashboard"
    send_email(Config.SCHOOL_EMAIL, subject, body)

# ============================================
# SECURITY HEADERS
# ============================================

@app.after_request
def add_security_headers(response):
    """Add security headers to all responses."""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; frame-src https://www.google.com https://www.youtube.com;"
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
    return response

@app.before_request
def enforce_https():
    """Redirect HTTP to HTTPS in production."""
    if not request.is_secure and os.environ.get('FLASK_ENV') == 'production':
        url = request.url.replace('http://', 'https://', 1)
        return redirect(url, code=301)

# ============================================
# PUBLIC API ENDPOINTS
# ============================================

@app.route('/api/v1/contact', methods=['POST'])
@csrf.exempt
@limiter.limit("5 per hour")
def api_contact():
    """Handle contact form submissions."""
    try:
        data = request.get_json()
        
        name = sanitize_input(data.get('name', '').strip())
        email = sanitize_input(data.get('email', '').strip())
        phone = sanitize_input(data.get('phone', '').strip())
        subject = sanitize_input(data.get('subject', '').strip())
        message = sanitize_input(data.get('message', '').strip())
        
        if not name or not email or not message:
            return jsonify({'success': False, 'error': 'Name, email, and message are required.'}), 400
        
        submission_id = save_contact(name, email, phone, subject, message)
        app.logger.info(f"New contact submission #{submission_id} from {email}")
        
        auto_reply_subject = f"Thank you for contacting {Config.SCHOOL_NAME}"
        auto_reply_body = f"""Dear {name},

Thank you for reaching out to {Config.SCHOOL_NAME}. We have received your message and will get back to you within 24 hours.

For urgent matters, please call us at {Config.SCHOOL_PHONE}.

Your message reference: #{submission_id}

Warm regards,
{Config.SCHOOL_NAME} Administration
"""
        send_email(email, auto_reply_subject, auto_reply_body)
        send_admin_notification('contact', {
            'Name': name, 'Email': email, 'Phone': phone,
            'Subject': subject, 'Message': message[:200] + '...' if len(message) > 200 else message
        })
        
        return jsonify({'success': True, 'message': 'Your message has been received. Check your email for a confirmation.', 'reference_id': submission_id})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/v1/admissions', methods=['POST'])
@csrf.exempt
@limiter.limit("5 per hour")
def api_admissions():
    """Handle admissions inquiry form submissions."""
    try:
        data = request.get_json()
        
        parent_name = sanitize_input(data.get('parent_name', '').strip())
        email = sanitize_input(data.get('email', '').strip())
        phone = sanitize_input(data.get('phone', '').strip())
        child_name = sanitize_input(data.get('child_name', '').strip())
        child_dob = sanitize_input(data.get('child_dob', '').strip())
        grade_applying = sanitize_input(data.get('grade_applying', '').strip())
        current_school = sanitize_input(data.get('current_school', '').strip())
        message = sanitize_input(data.get('message', '').strip())
        
        if not parent_name or not email or not child_name or not grade_applying:
            return jsonify({'success': False, 'error': 'Parent name, email, child name, and grade are required.'}), 400
        
        submission_id = save_admission(parent_name, email, phone, child_name, child_dob, grade_applying, current_school, message)
        app.logger.info(f"New admission inquiry #{submission_id} from {email} for grade {grade_applying}")
        
        auto_reply_subject = f"Thank you for your interest in {Config.SCHOOL_NAME}"
        auto_reply_body = f"""Dear {parent_name},

Thank you for your interest in {Config.SCHOOL_NAME} for {child_name}.

We have received your admissions inquiry for {grade_applying}. Our admissions team will contact you within 24 hours to discuss the next steps.

Your inquiry reference: #{submission_id}

Warm regards,
Admissions Office
{Config.SCHOOL_NAME}
Phone: {Config.SCHOOL_PHONE}
"""
        send_email(email, auto_reply_subject, auto_reply_body)
        send_admin_notification('admission', {
            'Parent': parent_name, 'Email': email, 'Phone': phone,
            'Child': child_name, 'Grade': grade_applying, 'Current School': current_school or 'N/A'
        })
        
        return jsonify({'success': True, 'message': 'Your inquiry has been received. Check your email for a confirmation.', 'reference_id': submission_id})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/v1/careers', methods=['POST'])
@csrf.exempt
@limiter.limit("3 per hour")
def api_careers():
    """Handle career application submissions."""
    try:
        if request.files and 'cv' in request.files:
            data = request.form
            name = sanitize_input(data.get('name', '').strip())
            email = sanitize_input(data.get('email', '').strip())
            phone = sanitize_input(data.get('phone', '').strip())
            position_applying = sanitize_input(data.get('position_applying', '').strip())
            cover_letter = sanitize_input(data.get('cover_letter', '').strip())
            
            cv_file = request.files['cv']
            cv_filename = 'Not uploaded'
            
            if cv_file and cv_file.filename:
                if not allowed_file(cv_file.filename):
                    return jsonify({'success': False, 'error': 'Invalid file type. Only PDF and Word documents allowed.'}), 400
                if not validate_file_size(cv_file):
                    return jsonify({'success': False, 'error': 'File too large. Maximum size is 5MB.'}), 400
                cv_filename = cv_file.filename
        else:
            data = request.get_json()
            name = sanitize_input(data.get('name', '').strip())
            email = sanitize_input(data.get('email', '').strip())
            phone = sanitize_input(data.get('phone', '').strip())
            position_applying = sanitize_input(data.get('position_applying', '').strip())
            cover_letter = sanitize_input(data.get('cover_letter', '').strip())
            cv_filename = data.get('cv_filename', 'Not uploaded')
        
        if not name or not email or not phone or not cover_letter:
            return jsonify({'success': False, 'error': 'Name, email, phone, and cover letter are required.'}), 400
        
        submission_id = save_career(name, email, phone, position_applying, cover_letter, cv_filename)
        app.logger.info(f"New career application #{submission_id} from {email} for {position_applying}")
        
        auto_reply_subject = f"Application Received - {Config.SCHOOL_NAME}"
        auto_reply_body = f"""Dear {name},

Thank you for applying for the {position_applying or 'position'} at {Config.SCHOOL_NAME}.

Your application has been received and is being reviewed by our HR team. If your qualifications match our requirements, we will contact you within 7 working days.

Application reference: #{submission_id}

Warm regards,
Human Resources
{Config.SCHOOL_NAME}
"""
        send_email(email, auto_reply_subject, auto_reply_body)
        send_admin_notification('career', {
            'Applicant': name, 'Email': email, 'Phone': phone,
            'Position': position_applying or 'General Application'
        })
        
        return jsonify({'success': True, 'message': 'Your application has been received. Check your email for confirmation.', 'reference_id': submission_id})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/v1/newsletter', methods=['POST'])
@csrf.exempt
@limiter.limit("10 per hour")
def api_newsletter():
    """Handle newsletter subscription."""
    try:
        data = request.get_json()
        email = sanitize_input(data.get('email', '').strip())
        
        if not email:
            return jsonify({'success': False, 'error': 'Email is required.'}), 400
        
        is_new = save_newsletter(email)
        
        if is_new:
            app.logger.info(f"New newsletter subscription: {email}")
            subject = f"Welcome to {Config.SCHOOL_NAME} Newsletter"
            body = f"""Dear Subscriber,

Thank you for subscribing to the {Config.SCHOOL_NAME} newsletter!

You will now receive updates about school events, achievements, and important announcements.

Warm regards,
{Config.SCHOOL_NAME}
"""
            send_email(email, subject, body)
            return jsonify({'success': True, 'message': 'Successfully subscribed!'})
        else:
            return jsonify({'success': True, 'message': 'You are already subscribed.'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# ADMIN ROUTES
# ============================================

@app.route('/admin')
def admin_redirect():
    """Redirect to login or dashboard."""
    if 'admin_logged_in' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login_page'))

@app.route('/admin/login', methods=['GET', 'POST'])
@limiter.limit("10 per minute")
def login_page():
    """Admin login page."""
    if request.method == 'POST':
        username = request.form.get('username', '')
        password = request.form.get('password', '')
        
        admin = get_admin_by_username(username)
        
        if admin and check_password_hash(admin['password_hash'], password):
            app.logger.info(f"Successful login: {username} from {request.remote_addr}")
            audit_log('login', 'Admin logged in successfully')
            
            session.permanent = True
            session['admin_logged_in'] = True
            session['admin_username'] = username
            session['admin_full_name'] = admin['full_name']
            session['admin_role'] = admin['role']
            session['last_activity'] = datetime.now().isoformat()
            
            update_admin_last_login(admin['id'])
            
            return redirect(url_for('dashboard'))
        else:
            app.logger.warning(f"Failed login attempt for username: {username} from {request.remote_addr}")
            audit_log('login_failed', f'Failed login attempt for: {username}')
            return render_template('login.html', error='Invalid username or password.')
    
    return render_template('login.html')

@app.route('/admin/logout')
def logout():
    """Admin logout."""
    audit_log('logout', 'Admin logged out')
    app.logger.info(f"Admin logout: {session.get('admin_username', 'Unknown')}")
    session.clear()
    return redirect(url_for('login_page'))

@app.route('/admin/dashboard')
@login_required
def dashboard():
    """Admin dashboard overview."""
    stats = get_stats()
    return render_template('dashboard.html', stats=stats)

@app.route('/admin/<submission_type>')
@login_required
def view_submissions(submission_type):
    """View submissions by type."""
    if submission_type not in ['contacts', 'admissions', 'careers']:
        return redirect(url_for('dashboard'))
    
    status_filter = request.args.get('status', 'All')
    submissions = get_all_submissions(submission_type, status_filter)
    stats = get_stats()
    
    return render_template('dashboard.html',
                         stats=stats,
                         submissions=submissions,
                         submission_type=submission_type,
                         current_filter=status_filter)

@app.route('/admin/<submission_type>/<int:submission_id>')
@login_required
def view_message(submission_type, submission_id):
    """View a single submission and its replies."""
    if submission_type not in ['contacts', 'admissions', 'careers']:
        return redirect(url_for('dashboard'))
    
    submission = get_submission(submission_type, submission_id)
    replies = get_replies_for_submission(submission_type, submission_id)
    
    if not submission:
        return redirect(url_for('dashboard'))
    
    return render_template('message.html',
                         submission=submission,
                         submission_type=submission_type,
                         replies=replies)

@app.route('/admin/<submission_type>/<int:submission_id>/reply', methods=['POST'])
@login_required
def send_reply(submission_type, submission_id):
    """Send a reply to a submission."""
    if submission_type not in ['contacts', 'admissions', 'careers']:
        return jsonify({'success': False, 'error': 'Invalid submission type.'}), 400
    
    submission = get_submission(submission_type, submission_id)
    if not submission:
        return jsonify({'success': False, 'error': 'Submission not found.'}), 404
    
    reply_body = request.form.get('reply_body', '').strip()
    if not reply_body:
        return jsonify({'success': False, 'error': 'Reply cannot be empty.'}), 400
    
    recipient_email = submission.get('email')
    subject = f"Re: Your inquiry to {Config.SCHOOL_NAME} (Ref: #{submission_id})"
    full_body = f"{reply_body}\n\n---\n{Config.SCHOOL_NAME}\n{Config.SCHOOL_PHONE}\n{Config.SCHOOL_EMAIL}"
    
    send_email(recipient_email, subject, full_body)
    save_reply(submission_type, submission_id, recipient_email, subject, reply_body)
    update_status(submission_type, submission_id, 'Replied')
    
    app.logger.info(f"Admin {session.get('admin_username')} replied to {submission_type} #{submission_id} - sent to {recipient_email}")
    audit_log('reply_sent', f'Replied to {submission_type} #{submission_id}')
    
    return jsonify({'success': True, 'message': 'Reply sent successfully.'})

@app.route('/admin/<submission_type>/<int:submission_id>/status', methods=['POST'])
@login_required
def update_submission_status(submission_type, submission_id):
    """Update submission status."""
    if submission_type not in ['contacts', 'admissions', 'careers']:
        return jsonify({'success': False, 'error': 'Invalid submission type.'}), 400
    
    new_status = request.form.get('status', '').strip()
    notes = request.form.get('notes', '').strip()
    
    if not new_status:
        return jsonify({'success': False, 'error': 'Status is required.'}), 400
    
    update_status(submission_type, submission_id, new_status, notes if notes else None)
    
    app.logger.info(f"Admin {session.get('admin_username')} changed {submission_type} #{submission_id} status to '{new_status}'")
    audit_log('status_updated', f'Changed {submission_type} #{submission_id} to {new_status}')
    
    return jsonify({'success': True, 'message': 'Status updated.'})

@app.route('/admin/<submission_type>/bulk-action', methods=['POST'])
@login_required
def bulk_action(submission_type):
    """Perform bulk actions on submissions."""
    if submission_type not in ['contacts', 'admissions', 'careers']:
        return jsonify({'success': False, 'error': 'Invalid submission type.'}), 400
    
    data = request.get_json()
    action = data.get('action', '')
    submission_ids = data.get('ids', [])
    
    if not submission_ids:
        return jsonify({'success': False, 'error': 'No submissions selected.'}), 400
    
    if action == 'mark_replied':
        for sid in submission_ids:
            update_status(submission_type, sid, 'Replied')
    elif action == 'mark_closed':
        for sid in submission_ids:
            update_status(submission_type, sid, 'Closed')
    elif action == 'delete':
        from database import get_db
        conn = get_db()
        cursor = conn.cursor()
        table = get_table_name(submission_type)
        for sid in submission_ids:
            cursor.execute(f'DELETE FROM {table} WHERE id = ?', (sid,))
            cursor.execute('DELETE FROM replies WHERE submission_type = ? AND submission_id = ?', (submission_type, sid))
        conn.commit()
        conn.close()
    
    app.logger.info(f"Admin {session.get('admin_username')} bulk {action} on {len(submission_ids)} {submission_type}")
    audit_log('bulk_action', f'{action} on {len(submission_ids)} {submission_type}')
    
    return jsonify({'success': True, 'message': f'{action} applied to {len(submission_ids)} submissions.'})

@app.route('/admin/<submission_type>/export')
@login_required
def export_submissions(submission_type):
    """Export submissions to CSV."""
    if submission_type not in ['contacts', 'admissions', 'careers']:
        return redirect(url_for('dashboard'))
    
    import csv
    from io import StringIO
    
    submissions = get_all_submissions(submission_type)
    if not submissions:
        return redirect(url_for('view_submissions', submission_type=submission_type))
    
    si = StringIO()
    writer = csv.writer(si)
    
    if submission_type == 'contacts':
        writer.writerow(['ID', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Notes', 'Date'])
        for s in submissions:
            writer.writerow([s['id'], s['name'], s['email'], s['phone'], s['subject'], s['message'], s['status'], s.get('notes', ''), s['created_at']])
    elif submission_type == 'admissions':
        writer.writerow(['ID', 'Parent Name', 'Email', 'Phone', 'Child Name', 'DOB', 'Grade', 'Current School', 'Message', 'Status', 'Notes', 'Date'])
        for s in submissions:
            writer.writerow([s['id'], s['parent_name'], s['email'], s['phone'], s['child_name'], s['child_dob'], s['grade_applying'], s['current_school'], s['message'], s['status'], s.get('notes', ''), s['created_at']])
    elif submission_type == 'careers':
        writer.writerow(['ID', 'Name', 'Email', 'Phone', 'Position', 'Cover Letter', 'CV', 'Status', 'Notes', 'Date'])
        for s in submissions:
            writer.writerow([s['id'], s['name'], s['email'], s['phone'], s['position_applying'], s['cover_letter'][:200], s['cv_filename'], s['status'], s.get('notes', ''), s['created_at']])
    
    output = si.getvalue()
    si.close()
    
    response = make_response(output)
    response.headers['Content-Type'] = 'text/csv'
    response.headers['Content-Disposition'] = f'attachment; filename=nyambunwa-{submission_type}-export.csv'
    
    audit_log('export', f'Exported {submission_type} data')
    app.logger.info(f"Admin {session.get('admin_username')} exported {submission_type}")
    
    return response

@app.route('/admin/audit-log')
@login_required
def view_audit_log():
    """View audit log."""
    from database import get_audit_logs
    logs = get_audit_logs(200)
    return render_template('audit.html', logs=logs)

@app.route('/admin/stats')
@login_required
def admin_stats():
    """API endpoint for dashboard statistics."""
    stats = get_stats()
    return jsonify(stats)

# ============================================
# ERROR HANDLERS
# ============================================

@app.errorhandler(404)
def not_found_error(error):
    """Custom 404 page."""
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    """Custom 500 page."""
    app.logger.error(f"Server error: {error}")
    return render_template('500.html'), 500

# ============================================
# RUN THE APPLICATION
# ============================================

if __name__ == '__main__':
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    print(f"\n{'='*50}")
    print(f"  {Config.SCHOOL_NAME} BACKEND")
    print(f"  Running at: http://localhost:5000")
    print(f"  Admin Panel: http://localhost:5000/admin")
    print(f"  Debug Mode: {debug_mode}")
    print(f"{'='*50}\n")
    app.run(debug=debug_mode, port=5000, host='0.0.0.0')