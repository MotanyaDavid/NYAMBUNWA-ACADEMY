// ============================================
// NYAMBUNWA ACADEMY - Admin Dashboard JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    
    // ==========================================
    // STATUS UPDATE FORM
    // ==========================================
    const statusForm = document.getElementById('status-form');
    
    if (statusForm) {
        statusForm.addEventListener('submit', function (event) {
            event.preventDefault();
            
            const status = document.getElementById('status-select').value;
            const notes = document.getElementById('notes').value;
            
            const formData = new FormData();
            formData.append('status', status);
            formData.append('notes', notes);
            
            fetch(`/admin/${SUBMISSION_TYPE}/${SUBMISSION_ID}/status`, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast('✅ Status updated successfully!', 'success');
                    // Update the status badge in topbar
                    const topbarBadge = document.querySelector('.topbar .status-badge');
                    if (topbarBadge) {
                        topbarBadge.textContent = status;
                        topbarBadge.className = 'status-badge status-badge--' + status.toLowerCase().replace(' ', '-');
                    }
                } else {
                    showToast('❌ ' + data.error, 'error');
                }
            })
            .catch(error => {
                showToast('❌ Network error. Please try again.', 'error');
                console.error('Error:', error);
            });
        });
    }
    
    // ==========================================
    // REPLY FORM
    // ==========================================
    const replyForm = document.getElementById('reply-form');
    
    if (replyForm) {
        replyForm.addEventListener('submit', function (event) {
            event.preventDefault();
            
            const replyBody = document.getElementById('reply-body').value.trim();
            
            if (!replyBody) {
                showToast('❌ Reply cannot be empty.', 'error');
                return;
            }
            
            const formData = new FormData();
            formData.append('reply_body', replyBody);
            
            const submitBtn = replyForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            fetch(`/admin/${SUBMISSION_TYPE}/${SUBMISSION_ID}/reply`, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast('✅ Reply sent successfully!', 'success');
                    document.getElementById('reply-body').value = '';
                    
                    // Reload the page after a short delay to show reply history
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    showToast('❌ ' + data.error, 'error');
                }
            })
            .catch(error => {
                showToast('❌ Network error. Please try again.', 'error');
                console.error('Error:', error);
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }
    
    // ==========================================
    // TOAST NOTIFICATION
    // ==========================================
    function showToast(message, type) {
        // Remove existing toasts
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = 'toast toast--' + type;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            padding: 14px 24px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.9rem;
            z-index: 9999;
            animation: slideUp 0.3s ease, fadeOut 0.5s ease 3s forwards;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            max-width: 400px;
        `;
        
        if (type === 'success') {
            toast.style.background = '#d4edda';
            toast.style.color = '#155724';
            toast.style.border = '1px solid #c3e6cb';
        } else {
            toast.style.background = '#ffe0e0';
            toast.style.color = '#c0392b';
            toast.style.border = '1px solid #ffb8b8';
        }
        
        document.body.appendChild(toast);
        
        // Auto-remove after 3.5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3500);
    }
    
    // Add toast animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // ==========================================
    // CONFIRMATION FOR LEAVING UNSAVED FORMS
    // ==========================================
    const textareas = document.querySelectorAll('textarea');
    let formModified = false;
    
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function () {
            formModified = true;
        });
    });
    
    window.addEventListener('beforeunload', function (event) {
        if (formModified) {
            event.preventDefault();
            event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        }
    });
    
    // Clear modified flag when form is submitted
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function () {
            formModified = false;
        });
    });
    
    // ==========================================
    // TABLE ROW CLICK (navigate to detail)
    // ==========================================
    const dataTable = document.querySelector('.data-table');
    if (dataTable) {
        const rows = dataTable.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.addEventListener('click', function (event) {
                // Don't navigate if clicking a button or link
                if (event.target.closest('a, button')) return;
                
                const viewLink = this.querySelector('a[href*="view_message"]');
                if (viewLink) {
                    window.location.href = viewLink.href;
                }
            });
            
            // Add pointer cursor
            row.style.cursor = 'pointer';
        });
    }
    
});