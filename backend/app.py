# ============================================
# NYAMBUNWA ACADEMY BACKEND
# app.py - Main Flask Application
# ============================================

import logging
from logging.handlers import RotatingFileHandler
from werkzeug.security import check_password_hash
from flask_limiter import Limiter
from datetime import timedelta
from flask_limiter.util import get_remote_address
from flask import Flask, request, jsonify, render_template, session, redirect, url_for
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect
from functools import wraps
import os
import bleach
from datetime import datetime
from config import Config
from database import (
    init_db, save_contact, save_admission, save_career, save_newsletter,
    save_reply, update_status, get_all_submissions, get_submission,
    get_replies_for_submission, get_stats
)

app = Flask(__name__)
# Configure logging
if not app.debug:
    # Create logs directory
    log_dir = os.path.join(os.path.dirname(__file__), 'logs')
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
    
    # Set up file handler
    file_handler = RotatingFileHandler(
        os.path.join(log_dir, 'nyambunwa.log'),
        maxBytes=1024 * 1024,  # 1MB
        backupCount=10
    )
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('Nyambunwa Academy Backend started')
# Session configuration
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)
app.config['SESSION_REFRESH_EACH_REQUEST'] = True
# Rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)
@app.after_request
def add_security_headers(response):
    """Add security headers to all responses."""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; frame-src https://www.google.com https://www.youtube.com;"
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
    return response

@app.before_request
def enforce_https():
    """Redirect HTTP to HTTPS in production."""
    if not request.is_secure and os.environ.get('FLASK_ENV') == 'production':
        url = request.url.replace('http://', 'https://', 1)
        return redirect(url, code=301)
csrf = CSRFProtect(app)
app.secret_key = Config.SECRET_KEY
  # Allow requests from your website
allowed_origins = os.environ.get('ALLOWED_ORIGINS', 'http://localhost:5000,http://127.0.0.1:5000').split(',')
CORS(app, origins=allowed_origins)

# Initialize database on startup
init_db()

# ============================================
# DECORATORS
# ============================================


def sanitize_input(text):
    """Remove dangerous HTML/scripts from user input."""
    if text is None:
        return None
    return bleach.clean(str(text), tags=[], strip=True)
def login_required(f):
    """Decorator to protect admin routes."""
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

ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_file_size(file_storage):
    """Check if file size is within limits."""
    file_storage.seek(0, os.SEEK_END)
    size = file_storage.tell()
    file_storage.seek(0)
    return size <= MAX_FILE_SIZE

# ============================================
# EMAIL HELPER
# ============================================

def send_email(to_email, subject, body):
    """Send an email. In production, configure SMTP settings in config.py."""
    # For now, print to console. Uncomment below for real email sending.
    print(f"\n{'='*50}")
    print(f"EMAIL SENT:")
    print(f"To: {to_email}")
    print(f"Subject: {subject}")
    print(f"Body: {body}")
    print(f"{'='*50}\n")
    
    # Uncomment this block when you have email configured:
    # import smtplib
    # from email.mime.text import MIMEText
    # from email.mime.multipart import MIMEMultipart
    # 
    # msg = MIMEMultipart()
    # msg['From'] = Config.MAIL_USERNAME
    # msg['To'] = to_email
    # msg['Subject'] = subject
    # msg.attach(MIMEText(body, 'plain'))
    # 
    # with smtplib.SMTP(Config.MAIL_SERVER, Config.MAIL_PORT) as server:
    #     server.starttls()
    #     server.login(Config.MAIL_USERNAME, Config.MAIL_PASSWORD)
    #     server.send_message(msg)
    
    return True

def send_admin_notification(submission_type, data):
    """Send notification to admin when a new submission arrives."""
    subject = f"New {submission_type.capitalize()} Submission - {Config.SCHOOL_NAME}"
    body = f"A new {submission_type} form has been submitted.\n\n"
    
    for key, value in data.items():
        body += f"{key.replace('_', ' ').title()}: {value}\n"
    
    body += f"\nView in dashboard: http://localhost:5000/admin/dashboard"
    
    send_email(Config.SCHOOL_EMAIL, subject, body)

# ============================================
# PUBLIC API ENDPOINTS (Your website calls these)
# ============================================

@app.route('/api/contact', methods=['POST'])
@csrf.exempt
@limiter.limit("5 per hour")  # 5 contact messages per hour per IP
def api_contact():
    """Handle contact form submissions."""
    try:
        data = request.get_json()
        
        name = sanitize_input(data.get('name', '').strip())
        email = sanitize_input(data.get('email', '').strip())
        phone = sanitize_input(data.get('phone', '').strip())
        subject = sanitize_input(data.get('subject', '').strip())
        message = sanitize_input(data.get('message', '').strip())
        
        # Validation
        if not name or not email or not message:
            return jsonify({'success': False, 'error': 'Name, email, and message are required.'}), 400
        
        # Save to database
        submission_id = save_contact(name, email, phone, subject, message)
        app.logger.info(f"New contact submission #{submission_id} from {email}")
        
        # Send auto-reply to sender
        auto_reply_subject = f"Thank you for contacting {Config.SCHOOL_NAME}"
        auto_reply_body = f"""Dear {name},

Thank you for reaching out to {Config.SCHOOL_NAME}. We have received your message and will get back to you within 24 hours.

For urgent matters, please call us at {Config.SCHOOL_PHONE}.

Your message reference: #{submission_id}

Warm regards,
{Config.SCHOOL_NAME} Administration
"""
        send_email(email, auto_reply_subject, auto_reply_body)
        
        # Notify admin
        send_admin_notification('contact', {
            'Name': name,
            'Email': email,
            'Phone': phone,
            'Subject': subject,
            'Message': message[:200] + '...' if len(message) > 200 else message
        })
        
        return jsonify({
            'success': True,
            'message': 'Your message has been received. Check your email for a confirmation.',
            'reference_id': submission_id
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/admissions', methods=['POST'])
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
        
        # Validation
        if not parent_name or not email or not child_name or not grade_applying:
            return jsonify({'success': False, 'error': 'Parent name, email, child name, and grade are required.'}), 400
        
        # Save to database
        submission_id = save_admission(parent_name, email, phone, child_name, child_dob, grade_applying, current_school, message)
        app.logger.info(f"New admission inquiry #{submission_id} from {email} for grade {grade_applying}")
        
        # Send auto-reply
        auto_reply_subject = f"Thank you for your interest in {Config.SCHOOL_NAME}"
        auto_reply_body = f"""Dear {parent_name},

Thank you for your interest in {Config.SCHOOL_NAME} for {child_name}.

We have received your admissions inquiry for {grade_applying}. Our admissions team will contact you within 24 hours to discuss the next steps, including scheduling a campus tour.

In the meantime, you can download our prospectus and fee structure from our website.

Your inquiry reference: #{submission_id}

We look forward to welcoming your family to {Config.SCHOOL_NAME}!

Warm regards,
Admissions Office
{Config.SCHOOL_NAME}
Phone: {Config.SCHOOL_PHONE}
"""
        send_email(email, auto_reply_subject, auto_reply_body)
        
        # Notify admin
        send_admin_notification('admission', {
            'Parent': parent_name,
            'Email': email,
            'Phone': phone,
            'Child': child_name,
            'Grade': grade_applying,
            'Current School': current_school or 'N/A'
        })
        
        return jsonify({
            'success': True,
            'message': 'Your inquiry has been received. Check your email for a confirmation.',
            'reference_id': submission_id
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/careers', methods=['POST'])
@csrf.exempt
@limiter.limit("3 per hour")
def api_careers():
    """Handle career application submissions."""
    try:
        # Check if the request has a file
        if request.files and 'cv' in request.files:
            # File upload mode
            data = request.form
            name = sanitize_input(data.get('name', '').strip())
            email = sanitize_input(data.get('email', '').strip())
            phone = sanitize_input(data.get('phone', '').strip())
            position_applying = sanitize_input(data.get('position_applying', '').strip())
            cover_letter = sanitize_input(data.get('cover_letter', '').strip())
            
            # Handle file upload
            cv_file = request.files['cv']
            cv_filename = 'Not uploaded'
            
            if cv_file and cv_file.filename:
                # Validate file type
                if not allowed_file(cv_file.filename):
                    return jsonify({'success': False, 'error': 'Invalid file type. Only PDF and Word documents (.pdf, .doc, .docx) are allowed.'}), 400
                
                # Validate file size
                if not validate_file_size(cv_file):
                    return jsonify({'success': False, 'error': 'File too large. Maximum size is 5MB.'}), 400
                
                cv_filename = cv_file.filename
                # In Phase 2, save the file: cv_file.save(os.path.join('uploads', filename))
        else:
            # JSON mode (no file)
            data = request.get_json()
            name = sanitize_input(data.get('name', '').strip())
            email = sanitize_input(data.get('email', '').strip())
            phone = sanitize_input(data.get('phone', '').strip())
            position_applying = sanitize_input(data.get('position_applying', '').strip())
            cover_letter = sanitize_input(data.get('cover_letter', '').strip())
            cv_filename = data.get('cv_filename', 'Not uploaded')
        
        # Validation
        if not name or not email or not phone or not cover_letter:
            return jsonify({'success': False, 'error': 'Name, email, phone, and cover letter are required.'}), 400
        
        # Save to database
        submission_id = save_career(name, email, phone, position_applying, cover_letter, cv_filename)
        app.logger.info(f"New career application #{submission_id} from {email} for {position_applying}")
        
        # Send auto-reply
        auto_reply_subject = f"Application Received - {Config.SCHOOL_NAME}"
        auto_reply_body = f"""Dear {name},

Thank you for applying for the {position_applying or 'position'} at {Config.SCHOOL_NAME}.

Your application has been received and is being reviewed by our HR team. If your qualifications match our requirements, we will contact you within 7 working days to schedule an interview.

Application reference: #{submission_id}

We appreciate your interest in joining the {Config.SCHOOL_NAME} community.

Warm regards,
Human Resources
{Config.SCHOOL_NAME}
"""
        send_email(email, auto_reply_subject, auto_reply_body)
        
        # Notify admin
        send_admin_notification('career', {
            'Applicant': name,
            'Email': email,
            'Phone': phone,
            'Position': position_applying or 'General Application'
        })
        
        return jsonify({
            'success': True,
            'message': 'Your application has been received. Check your email for confirmation.',
            'reference_id': submission_id
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    

@app.route('/api/newsletter', methods=['POST'])
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
            # Send welcome email
            subject = f"Welcome to {Config.SCHOOL_NAME} Newsletter"
            body = f"""Dear Subscriber,

Thank you for subscribing to the {Config.SCHOOL_NAME} newsletter!

You will now receive updates about school events, achievements, and important announcements directly to your inbox.

If you ever wish to unsubscribe, simply click the unsubscribe link in any newsletter email.

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
        
        # Check credentials against database
        from database import get_admin_by_username, update_admin_last_login
        
        admin = get_admin_by_username(username)
        
        if admin and check_password_hash(admin['password_hash'], password):
            app.logger.info(f"Successful login: {username} from {request.remote_addr}")
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
            return render_template('login.html', error='Invalid username or password.')
    
    return render_template('login.html')

@app.route('/admin/logout')
def logout():
    """Admin logout."""
    app.logger.info(f"Admin logout: {session.get('admin_username', 'Unknown')}")
    session.clear()
    return redirect(url_for('login_page'))

@app.route('/admin/dashboard')
@login_required
def dashboard():
    """Admin dashboard showing all submissions."""
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
    
    return render_template('dashboard.html', 
                         stats=get_stats(),
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
    
    # Determine recipient email field
    email_field = 'email'
    recipient_email = submission.get(email_field)
    
    # Prepare subject
    subject = f"Re: Your inquiry to {Config.SCHOOL_NAME} (Ref: #{submission_id})"
    
    # Add signature
    full_body = f"{reply_body}\n\n---\n{Config.SCHOOL_NAME}\n{Config.SCHOOL_PHONE}\n{Config.SCHOOL_EMAIL}"
    
    # Send email
    send_email(recipient_email, subject, full_body)
    
    # Log reply in database
    save_reply(submission_type, submission_id, recipient_email, subject, reply_body)
    app.logger.info(f"Admin {session.get('admin_username', 'Unknown')} replied to {submission_type} #{submission_id} - sent to {recipient_email}")
    
    # Update status to 'Replied'
    update_status(submission_type, submission_id, 'Replied')
    
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
    app.logger.info(f"Admin {session.get('admin_username', 'Unknown')} changed {submission_type} #{submission_id} status to '{new_status}'")
    
    return jsonify({'success': True, 'message': 'Status updated.'})

@app.route('/admin/stats')
@login_required
def admin_stats():
    """API endpoint for dashboard statistics."""
    stats = get_stats()
    return jsonify(stats)

# ============================================
# RUN THE APPLICATION
# ============================================

# Custom error handlers
@app.errorhandler(404)
def not_found_error(error):
    """Custom 404 page."""
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    """Custom 500 page."""
    app.logger.error(f"Server error: {error}")
    return render_template('500.html'), 500

if __name__ == '__main__':
    import os
# Set debug mode based on environment variable (default to False)
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'

    print(f"\n{'='*50}")
    print(f"  {Config.SCHOOL_NAME} BACKEND")
    print(f"  Running at: http://localhost:5000")
    print(f"  Admin Panel: http://localhost:5000/admin")
    print(f"{'='*50}\n")
    app.run(debug=debug_mode, port=5000)