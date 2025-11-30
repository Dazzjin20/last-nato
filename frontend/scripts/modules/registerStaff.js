import { Validate } from "../helper/validateHelper.js";
export class RegisterStaff {
  constructor() {
    this.msgEl = null;
    this.validator = new Validate();
  }

  staffSignUp() {
    const staffForm = document.getElementById('js-staff-signup');
    if (!staffForm) return;

    this.createMessageElement(staffForm);

    staffForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleFormSubmission(staffForm);
    });
  }

  createMessageElement(form) {
    let msgEl = document.getElementById('staffSignupMessage');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.id = 'staffSignupMessage';
      msgEl.className = 'mt-3';
      form.parentNode.insertBefore(msgEl, form.nextSibling);
    }
    this.msgEl = msgEl;
  }

  async handleFormSubmission(form) {
    const formData = new FormData(form);
    
    const payload = {
      first_name: formData.get('staff_first_name'),
      last_name: formData.get('staff_last_name'),
      email: formData.get('staff_email'),
      phone: formData.get('staff_phone'),
      password: formData.get('staff_password'),
      consents: formData.getAll('staff_consents')
    };

    if (!this.validator.validatePayload(payload, this.msgEl)) {
      return;
    }

    await this.submitToBackend(payload, form);
  }

 

  async submitToBackend(payload, form) {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        this.validator.showMessage(this.msgEl, result.message || 'Staff registration successful!', 'success');
        form.reset();
        
        // Redirect to login page after successful registration
        setTimeout(() => {
          window.location.href = 'login-form.html';
        }, 2000);
      } else {
        this.validator.showMessage(this.msgEl, result.message || result.error || 'Staff registration failed.', 'danger');
      }
    } catch (error) {
      console.error('Staff registration error:', error);
      this.validator.showMessage(this.msgEl, 'Unable to connect to server. Please try again later.', 'danger');
    }
  }


}