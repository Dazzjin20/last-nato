import { Validate } from "../helper/validateHelper.js";
export class VolunteerSignUp {
  constructor() {
    this.msgEl = null;
    this.validator = new Validate();
  }

  volunteerSignUp() {
    const volunteerForm = document.querySelector('.js-volunteer-signup');
    if (!volunteerForm) return;

    this.createMessageElement(volunteerForm);

    volunteerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleFormSubmission(volunteerForm);
    });
  }

  createMessageElement(form) {
    let msgEl = document.getElementById('volunteerSignupMessage');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.id = 'volunteerSignupMessage';
      msgEl.className = 'mt-3';
      form.parentNode.insertBefore(msgEl, form.nextSibling);
    }
    this.msgEl = msgEl;
  }

  async handleFormSubmission(form) {
    const formData = new FormData(form);
    
    const payload = {
      first_name: formData.get('volunteer_first_name'),
      last_name: formData.get('volunteer_last_name'),
      email: formData.get('volunteer_email'),
      phone: formData.get('volunteer_phone'),
      password: formData.get('volunteer_password'),
      availability: formData.getAll('availability'),
      interested_activities: formData.getAll('interested_activities'),
      consents: formData.getAll('volunteer_consents')
    };

    if (!this.validator.validatePayload(payload, this.msgEl)) {
      return;
    }

    await this.submitToBackend(payload, form);
  }
  async submitToBackend(payload, form) {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register/volunteer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        this.validator.showMessage(this.msgEl, result.message || 'Volunteer registration successful!', 'success');
        form.reset();
        
        // Redirect to login page after successful registration
        setTimeout(() => {
          window.location.href = 'login-form.html';
        }, 2000);
      } else {
        this.validator.showMessage(this.msgEl, result.message || result.error || 'Volunteer registration failed.', 'danger');
      }
    } catch (error) {
      console.error('Volunteer registration error:', error);
      this.validator.showMessage(this.msgEl, 'Unable to connect to server. Please try again later.', 'danger');
    }
  }

}