// ============================================
// NYAMBUNWA ACADEMY - Admin Dashboard JavaScript
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // STATUS UPDATE FORM
  // ==========================================
  const statusForm = document.getElementById("status-form");

  if (statusForm) {
    statusForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const status = document.getElementById("status-select").value;
      const notes = document.getElementById("notes").value;

      const formData = new FormData();
      formData.append("status", status);
      formData.append("notes", notes);

      fetch(`/admin/${SUBMISSION_TYPE}/${SUBMISSION_ID}/status`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            showToast("✅ Status updated successfully!", "success");
            // Update the status badge in topbar
            const topbarBadge = document.querySelector(".topbar .status-badge");
            if (topbarBadge) {
              topbarBadge.textContent = status;
              topbarBadge.className =
                "status-badge status-badge--" +
                status.toLowerCase().replace(" ", "-");
            }
          } else {
            showToast("❌ " + data.error, "error");
          }
        })
        .catch((error) => {
          showToast("❌ Network error. Please try again.", "error");
          console.error("Error:", error);
        });
    });
  }

  // ==========================================
// LOGIN FORM VALIDATION
// ==========================================

const loginForm = document.querySelector('.login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        let errors = [];
        
        if (!username || !username.value.trim()) {
            errors.push('Please enter your username.');
        }
        if (!password || !password.value.trim()) {
            errors.push('Please enter your password.');
        }
        
        if (errors.length > 0) {
            e.preventDefault();
            alert(errors.join('\n'));
            return;
        }
    });
}

  // ==========================================
  // REPLY FORM
  // ==========================================
  const replyForm = document.getElementById("reply-form");

  if (replyForm) {
    replyForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const replyBody = document.getElementById("reply-body").value.trim();

      if (!replyBody) {
        showToast("❌ Reply cannot be empty.", "error");
        return;
      }

      const formData = new FormData();
      formData.append("reply_body", replyBody);

      const submitBtn = replyForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      fetch(`/admin/${SUBMISSION_TYPE}/${SUBMISSION_ID}/reply`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            showToast("✅ Reply sent successfully!", "success");
            document.getElementById("reply-body").value = "";

            // Reload the page after a short delay to show reply history
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            showToast("❌ " + data.error, "error");
          }
        })
        .catch((error) => {
          showToast("❌ Network error. Please try again.", "error");
          console.error("Error:", error);
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
    const existingToast = document.querySelector(".toast");
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = "toast toast--" + type;
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

    if (type === "success") {
      toast.style.background = "#d4edda";
      toast.style.color = "#155724";
      toast.style.border = "1px solid #c3e6cb";
    } else {
      toast.style.background = "#ffe0e0";
      toast.style.color = "#c0392b";
      toast.style.border = "1px solid #ffb8b8";
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
  const style = document.createElement("style");
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
  const textareas = document.querySelectorAll("textarea");
  let formModified = false;

  textareas.forEach((textarea) => {
    textarea.addEventListener("input", function () {
      formModified = true;
    });
  });

  window.addEventListener("beforeunload", function (event) {
    if (formModified) {
      event.preventDefault();
      event.returnValue =
        "You have unsaved changes. Are you sure you want to leave?";
    }
  });

  // Clear modified flag when form is submitted
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", function () {
      formModified = false;
    });
  });

  // ==========================================
  // TABLE ROW CLICK (navigate to detail)
  // ==========================================
  const dataTable = document.querySelector(".data-table");
  if (dataTable) {
    const rows = dataTable.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      row.addEventListener("click", function (event) {
        // Don't navigate if clicking a button or link
        if (event.target.closest("a, button")) return;

        const viewLink = this.querySelector('a[href*="view_message"]');
        if (viewLink) {
          window.location.href = viewLink.href;
        }
      });

      // Add pointer cursor
      row.style.cursor = "pointer";
    });
  }

  // ==========================================
  // N3: EMAIL REPLY TEMPLATES
  // ==========================================

  const templates = {
    admissions_tour: `Dear Parent/Guardian,

Thank you for your interest in Nyambunwa Academy. We would be delighted to welcome you for a campus tour.

You can visit us on Asumbi Road, Suneka, Kisii, Monday to Friday between 8:00 AM and 5:00 PM, or Saturday between 8:00 AM and 1:00 PM.

Please let us know a convenient date and time for your visit.

Warm regards,
Nyambunwa Academy Admissions
0757 862 075`,

    application_received: `Dear Applicant,

Thank you for submitting your application to Nyambunwa Academy. We have received all your documents and our admissions team is currently reviewing them.

We will contact you within 5-7 working days regarding the status of your application.

In the meantime, if you have any questions, please don't hesitate to contact us.

Warm regards,
Nyambunwa Academy Admissions`,

    interview_invite: `Dear Applicant,

Thank you for your application to join Nyambunwa Academy.

We are pleased to invite you for an interview on [DATE] at [TIME] at our campus on Asumbi Road, Suneka, Kisii.

Please bring the following documents:
- Original academic certificates
- National ID or passport
- Any additional supporting documents

Kindly confirm your availability by replying to this email or calling 0757 862 075.

We look forward to meeting you.

Warm regards,
Nyambunwa Academy HR`,

    general_response: `Dear [Name],

Thank you for contacting Nyambunwa Academy.

We appreciate your inquiry and will get back to you with a detailed response shortly.

If your matter is urgent, please call us at 0757 862 075.

Warm regards,
Nyambunwa Academy`,

    thank_you: `Dear [Name],

Thank you for reaching out to Nyambunwa Academy. We value your interest in our school.

Your message has been received and noted. If you need further assistance, please don't hesitate to contact us.

Warm regards,
Nyambunwa Academy`,
  };

  document.querySelectorAll(".template-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const templateKey = this.getAttribute("data-template");
      const replyTextarea = document.getElementById("reply-body");

      if (replyTextarea && templates[templateKey]) {
        replyTextarea.value = templates[templateKey];
        replyTextarea.focus();

        // Show feedback
        const originalText = this.textContent;
        this.textContent = "✓ Applied!";
        this.style.background = "#28A745";
        this.style.color = "white";
        setTimeout(() => {
          this.textContent = originalText;
          this.style.background = "#f8f9fa";
          this.style.color = "";
        }, 1500);
      }
    });
  });

  // ==========================================
  // N7: TAB NOTIFICATION BADGE
  // ==========================================

  let newSubmissionsCount = 0;
  let originalTitle = document.title;

  function updateTabBadge() {
    // Fetch stats from backend
    fetch("/admin/stats")
      .then((res) => res.json())
      .then((stats) => {
        const totalNew =
          (stats.contacts_new || 0) +
          (stats.admissions_new || 0) +
          (stats.careers_new || 0);

        if (totalNew > 0) {
          document.title = `(${totalNew}) ${originalTitle}`;
        } else {
          document.title = originalTitle;
        }
        newSubmissionsCount = totalNew;
      })
      .catch(() => {});
  }

  // Check for new submissions every 60 seconds
  if (document.querySelector(".sidebar")) {
    originalTitle = document.title;
    setInterval(updateTabBadge, 60000);
    updateTabBadge();
  }

  // ==========================================
// N5: BULK ACTIONS
// ==========================================

let selectedIds = [];

function updateSelection() {
    const checkboxes = document.querySelectorAll('.submission-checkbox:checked');
    selectedIds = Array.from(checkboxes).map(cb => parseInt(cb.value));
    
    const bulkBar = document.getElementById('bulk-actions');
    const selectedCount = document.getElementById('selected-count');
    const selectAll = document.getElementById('select-all');
    
    if (bulkBar) {
        bulkBar.style.display = selectedIds.length > 0 ? 'flex' : 'none';
    }
    
    if (selectedCount) {
        selectedCount.textContent = selectedIds.length + ' selected';
    }
    
    // Update select all checkbox
    if (selectAll) {
        const allCheckboxes = document.querySelectorAll('.submission-checkbox');
        selectAll.checked = allCheckboxes.length > 0 && selectedIds.length === allCheckboxes.length;
        selectAll.indeterminate = selectedIds.length > 0 && selectedIds.length < allCheckboxes.length;
    }
}

function toggleSelectAll() {
    const selectAll = document.getElementById('select-all');
    const checkboxes = document.querySelectorAll('.submission-checkbox');
    
    checkboxes.forEach(cb => {
        cb.checked = selectAll.checked;
    });
    
    updateSelection();
}

function clearSelection() {
    document.querySelectorAll('.submission-checkbox').forEach(cb => {
        cb.checked = false;
    });
    document.getElementById('select-all').checked = false;
    updateSelection();
}

function bulkAction(action) {
    if (selectedIds.length === 0) {
        alert('No submissions selected.');
        return;
    }
    
    const confirmMessages = {
        'mark_replied': 'Mark ' + selectedIds.length + ' submissions as Replied?',
        'mark_closed': 'Close ' + selectedIds.length + ' submissions?',
        'delete': 'PERMANENTLY DELETE ' + selectedIds.length + ' submissions? This cannot be undone!'
    };
    
    if (!confirm(confirmMessages[action])) return;
    
    // Get submission type from URL
    const pathParts = window.location.pathname.split('/');
    const submissionType = pathParts[pathParts.length - 1].split('?')[0];
    
    fetch('/admin/' + submissionType + '/bulk-action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('input[name="csrf_token"]').value
        },
        body: JSON.stringify({
            action: action,
            ids: selectedIds
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            window.location.reload();
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(err => {
        console.error(err);
        alert('Network error. Please try again.');
    });
}
});
