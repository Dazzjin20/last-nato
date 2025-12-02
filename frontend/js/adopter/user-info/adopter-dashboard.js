// Load user profile when page opens
  document.addEventListener('DOMContentLoaded', function() {
      // Get user data from localStorage
      const userData = localStorage.getItem('currentUser');
      
      if (!userData) {
          // Redirect to login if no user data
          window.location.href = 'login-form.html';
          return;
      }

      const user = JSON.parse(userData);
      updateUserProfile(user);
      setupEventListeners();
  });

  function updateUserProfile(user) {
      // Update profile name and role
      const fullName = `${user.first_name} ${user.last_name}`;
      const userRole = getUserRoleDisplay(user.role || user.user_type);
      
      // Update navbar profile
      const navbarName = document.getElementById('navbarUserName');
      const navbarRole = document.getElementById('navbarUserRole');
      if (navbarName) navbarName.textContent = fullName;
      if (navbarRole) navbarRole.textContent = userRole;
      
      // Update dropdown profile
      const dropdownName = document.getElementById('dropdownUserName');
      const dropdownRole = document.getElementById('dropdownUserRole');
      if (dropdownName) dropdownName.textContent = fullName;
      if (dropdownRole) dropdownRole.textContent = userRole;
      
      // Update welcome message
      const welcomeMessage = document.getElementById('welcomeMessage');
      if (welcomeMessage) {
          welcomeMessage.textContent = `Welcome Back, ${user.first_name} ${user.last_name}`;
      }
  }

  function setupEventListeners() {
      // Logout functionality
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
          logoutBtn.addEventListener('click', function(e) {
              e.preventDefault();
              localStorage.removeItem('authToken');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('userType');
              window.location.href = 'login-form.html';
          });
      }
      
      // Browse pets button
      const browseBtn = document.getElementById('browsePetsBtn');
      if (browseBtn) {
          browseBtn.addEventListener('click', function() {
              window.location.href = 'adopter-pet.html';
          });
      }
  }

  function getUserRoleDisplay(role) {
      const roles = {
          'adopter': 'Pet Adopter',
          'volunteer': 'Volunteer',
          'staff': 'Staff Member',
          'coordinator': 'Coordinator'
      };
      return roles[role] || 'User';
  }