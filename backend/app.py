# ============================================
# NYAMBUNWA ACADEMY BACKEND
# app.py - Main Flask Application
# ============================================

from flask import Flask, request, jsonify, render_template, session, redirect, url_for
from flask_cors import CORS
from functools import wraps
import os
from datetime import datetime

from config import Config
from database import (
    init_db, save_contact, save_admission, save_career, save_newsletter,
    save_reply, update_status, get_all_submissions, get_submission,
    get_replies_for_submission, get_stats
)

app = Flask(__name__)
app.secret_key = Config.SECRET_KEY
CORS(app)  # Allow requests from your website

# Initialize database on startup
init_db()

# ============================================
# DECORATORS
# ============================================

def login_required(f):
    """Decorator to protect admin routes."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_logged_in' not in session:
            return redirect(url_for('login_page'))
        return f(*args, **kwargs)
    return decorated_function

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
def api_contact():
    """Handle contact form submissions."""
    try:
        data = request.get_json()
        
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        subject = data.get('subject', '').strip()
        message = data.get('message', '').strip()
        
        # Validation
        if not name or not email or not message:
            return jsonify({'success': False, 'error': 'Name, email, and message are required.'}), 400
        
        # Save to database
        submission_id = save_contact(name, email, phone, subject, message)
        
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
def api_admissions():
    """Handle admissions inquiry form submissions."""
    try:
        data = request.get_json()
        
        parent_name = data.get('parent_name', '').strip()
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        child_name = data.get('child_name', '').strip()
        child_dob = data.get('child_dob', '').strip()
        grade_applying = data.get('grade_applying', '').strip()
        current_school = data.get('current_school', '').strip()
        message = data.get('message', '').strip()
        
        # Validation
        if not parent_name or not email or not child_name or not grade_applying:
            return jsonify({'success': False, 'error': 'Parent name, email, child name, and grade are required.'}), 400
        
        # Save to database
        submission_id = save_admission(parent_name, email, phone, child_name, child_dob, grade_applying, current_school, message)
        
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
def api_careers():
    """Handle career application submissions."""
    try:
        # This endpoint handles JSON data (no file upload for simplicity)
        # For CV uploads, you'd use multipart/form-data
        data = request.get_json()
        
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        position_applying = data.get('position_applying', '').strip()
        cover_letter = data.get('cover_letter', '').strip()
        cv_filename = data.get('cv_filename', 'Not uploaded')
        
        # Validation
        if not name or not email or not phone or not cover_letter:
            return jsonify({'success': False, 'error': 'Name, email, phone, and cover letter are required.'}), 400
        
        # Save to database
        submission_id = save_career(name, email, phone, position_applying, cover_letter, cv_filename)
        
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
def api_newsletter():
    """Handle newsletter subscription."""
    try:
        data = request.get_json()
        email = data.get('email', '').strip()
        
        if not email:
            return jsonify({'success': False, 'error': 'Email is required.'}), 400
        
        is_new = save_newsletter(email)
        
        if is_new:
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
def login_page():
    """Admin login page."""
    if request.method == 'POST':
        username = request.form.get('username', '')
        password = request.form.get('password', '')
        
        if username == Config.ADMIN_USERNAME and password == Config.ADMIN_PASSWORD:
            session['admin_logged_in'] = True
            session['admin_username'] = username
            return redirect(url_for('dashboard'))
        else:
            return render_template('login.html', error='Invalid username or password.')
    
    return render_template('login.html')

@app.route('/admin/logout')
def logout():
    """Admin logout."""
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

if __name__ == '__main__':
    print(f"\n{'='*50}")
    print(f"  {Config.SCHOOL_NAME} BACKEND")
    print(f"  Running at: http://localhost:5000")
    print(f"  Admin Panel: http://localhost:5000/admin")
    print(f"{'='*50}\n")
    app.run(debug=True, port=5000)