// Dashboard page locations - UPDATED FOR YOUR FOLDER STRUCTURE
const DASHBOARD_PATHS = {
    adopter: 'adopters/adopter-dashboard.html',
    volunteer: 'volunteer/volunteer-dashboard.html',
    staff: 'staff/staff-dashboard.html'
};

// Form switching logic
document.addEventListener('DOMContentLoaded', function() {
    // Map of all role switching buttons
    const roleButtons = {
        'Adopters': ['loginBtnAdopters', 'loginBtnAdopters2', 'loginBtnAdopters3'],
        'Volunteer': ['loginBtnVolunteer', 'loginBtnVolunteer2', 'loginBtnVolunteer3'],
        'Staff': ['loginBtnStaff', 'loginBtnStaff2', 'loginBtnStaff3']
    };
    
    // Switch between login forms
    function showForm(formType) {
        // Hide all forms
        document.getElementById('loginFormAdopters').classList.add('d-none');
        document.getElementById('loginFormVolunteer').classList.add('d-none');
        document.getElementById('loginFormStaff').classList.add('d-none');
        
        // Show selected form
        document.getElementById(`loginForm${formType.charAt(0).toUpperCase() + formType.slice(1)}`).classList.remove('d-none');
        
        // Update button styles for all button groups
        updateButtonStyles(formType);
    }
    
    function updateButtonStyles(activeType) {
        const buttonConfigs = [
            { adopters: 'loginBtnAdopters', volunteer: 'loginBtnVolunteer', staff: 'loginBtnStaff' },
            { adopters: 'loginBtnAdopters2', volunteer: 'loginBtnVolunteer2', staff: 'loginBtnStaff2' },
            { adopters: 'loginBtnAdopters3', volunteer: 'loginBtnVolunteer3', staff: 'loginBtnStaff3' }
        ];
        
        buttonConfigs.forEach(buttons => {
            Object.keys(buttons).forEach(type => {
                const btn = document.getElementById(buttons[type]);
                if (btn) {
                    if (type === activeType.toLowerCase()) {
                        btn.classList.remove('btn-outline-dark');
                        btn.classList.add('btn-dark');
                    } else {
                        btn.classList.remove('btn-dark');
                        btn.classList.add('btn-outline-dark');
                    }
                }
            });
        });
    }
    
    // Add event listeners to all role switching buttons
    Object.entries(roleButtons).forEach(([role, buttonIds]) => {
        buttonIds.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', () => showForm(role));
            }
        });
    });
    
    // Form submission handlers
    document.getElementById('loginFormAdopter')?.addEventListener('submit', handleAdopterLogin);
    document.getElementById('loginFormVolunteer')?.addEventListener('submit', handleVolunteerLogin);
    document.getElementById('loginFormStaff')?.addEventListener('submit', handleStaffLogin);
});

// Login handlers
async function handleAdopterLogin(e) {
    e.preventDefault();
    await handleLogin('adopter', 'adopterEmail', 'adopterPassword', 'loginMessageAdopter');
}

async function handleVolunteerLogin(e) {
    e.preventDefault();
    await handleLogin('volunteer', 'volunteerEmail', 'volunteerPassword', 'loginMessageVolunteer');
}

async function handleStaffLogin(e) {
    e.preventDefault();
    await handleLogin('staff', 'staffEmail', 'staffPassword', 'loginMessageStaff');
}

// Main login function
async function handleLogin(userType, emailFieldId, passwordFieldId, messageDivId) {
    const email = document.getElementById(emailFieldId).value;
    const password = document.getElementById(passwordFieldId).value;
    const messageDiv = document.getElementById(messageDivId);
    
    // Simple validation
    if (!email || !password) {
        showMessage(messageDiv, 'Please fill in all fields', 'error');
        return;
    }
    
    try {
        // Show loading state
        showMessage(messageDiv, 'Logging in...', 'loading');
        
        // Construct the correct API endpoint and call the backend
        const response = await fetch(`http://localhost:3000/api/auth/login/${userType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email, // ES6 shorthand for email: email
                password // ES6 shorthand for password: password
            })
        });
        
        const data = await response.json();

        
        
        if (response.ok) {
            // Save user data to localStorage
            const user = data.user;

            // ** ADDED: Check if the returned user role matches the form type **
            if (user && user.role === userType) {
                localStorage.setItem('authToken', data.token || 'demo-token');
                localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.setItem('userType', userType);
                
                showMessage(messageDiv, 'Login successful! Redirecting...', 'success');
                
                // Redirect to dashboard after 1 second
                setTimeout(() => {
                    window.location.href = DASHBOARD_PATHS[userType];
                }, 1000);
            } else {
                // If roles don't match, show an error
                const expectedRole = userType.charAt(0).toUpperCase() + userType.slice(1);
                showMessage(messageDiv, `Access Denied. This account is not a ${expectedRole} account.`, 'error');
            }
        } else {
            showMessage(messageDiv, data.error || 'Login failed', 'error');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        
        // DEMO MODE: If backend is not available, use demo login
        showMessage(messageDiv, 'Using demo mode...', 'loading');
        
        // Create demo user data
        const demoUser = {
            id: 'demo-' + Date.now(),
            first_name: email.split('@')[0],
            last_name: 'User',
            email: email,
            role: userType,
            user_type: userType
        };
        
        // Save demo data
        localStorage.setItem('authToken', 'demo-token');
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        localStorage.setItem('userType', userType);
        
        showMessage(messageDiv, 'Demo login successful! Redirecting...', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = DASHBOARD_PATHS[userType];
        }, 1000);
    }
}

// Helper function to show messages
function showMessage(messageDiv, text, type) {
    if (!messageDiv) return;
    
    const colors = {
        error: 'danger',
        success: 'success',
        loading: 'info'
    };
    
    messageDiv.innerHTML = `
        <div class="alert alert-${colors[type] || 'info'} alert-dismissible fade show" role="alert">
            ${text}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}