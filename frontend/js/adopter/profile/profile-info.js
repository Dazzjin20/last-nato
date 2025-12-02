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
      // Update navbar profile
      const fullName = `${user.first_name} ${user.last_name}`;
      const userRole = getUserRoleDisplay(user.role || user.user_type);
      
      const navbarName = document.getElementById('navbarUserName');
      const navbarRole = document.getElementById('navbarUserRole');
      if (navbarName) navbarName.textContent = fullName;
      if (navbarRole) navbarRole.textContent = userRole;
      
      // Update dropdown profile
      const dropdownName = document.getElementById('dropdownUserName');
      const dropdownRole = document.getElementById('dropdownUserRole');
      if (dropdownName) dropdownName.textContent = fullName;
      if (dropdownRole) dropdownRole.textContent = userRole;
      
      // Update profile information
      const profileDisplayName = document.getElementById('profileDisplayName');
      const userFirstName = document.getElementById('userFirstName');
      const userLastName = document.getElementById('userLastName');
      const userMiddleName = document.getElementById('userMiddleName');
      const userEmail = document.getElementById('userEmail');
      const userPhone = document.getElementById('userPhone');
      const userAddress = document.getElementById('userAddress');
      const userBio = document.getElementById('userBio');
      
      if (profileDisplayName) profileDisplayName.textContent = fullName;
      if (userFirstName) userFirstName.textContent = user.first_name || 'Keylist';
      if (userLastName) userLastName.textContent = user.last_name || 'Webbo';
      if (userMiddleName) userMiddleName.textContent = user.middle_name || '';
      if (userEmail) userEmail.textContent = user.email || 'Keylivebbo@gmail.com';
      if (userPhone) userPhone.textContent = user.phone || '+6399 8842 845';
      if (userAddress) userAddress.textContent = user.address || '123 Asawa ni Marie St.jude Pampanga';
      if (userBio) userBio.textContent = user.bio || 'Animal lover with a passion for giving rescue pets a second chance at happiness. Currently looking for a furry companion to join my family.';
      
      // Update member since date
      const memberSince = document.getElementById('memberSince');
      if (memberSince && user.created_at) {
          const joinDate = new Date(user.created_at);
          memberSince.textContent = `Member since ${joinDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      }
      
      // Update stats (you can fetch these from your backend)
      updateUserStats(user);
  }

  function updateUserStats(user) {
      // Update application count
      const applicationsCount = document.getElementById('applicationsCount');
      if (applicationsCount) {
          applicationsCount.textContent = `${user.stats?.applications || 3} Applications`;
      }
      
      // Update favorites count
      const favoritesCount = document.getElementById('favoritesCount');
      if (favoritesCount) {
          favoritesCount.textContent = `${user.stats?.favorites || 12} Favorites`;
      }
      
      // Update messages count
      const messagesCount = document.getElementById('messagesCount');
      if (messagesCount) {
          messagesCount.textContent = `${user.stats?.messages || 28} Messages`;
      }
      
      // Update performance age
      const performanceAge = document.getElementById('performanceAge');
      if (performanceAge && user.performance_level) {
          performanceAge.textContent = user.performance_level;
      }
      
      // Update user status
      const userStatus = document.getElementById('userStatus');
      if (userStatus && user.status) {
          userStatus.textContent = user.status === 'active' ? 'Active' : 'In Active';
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

      // Edit profile button
      const editProfileBtn = document.getElementById('editProfileBtn');
      if (editProfileBtn) {
          editProfileBtn.addEventListener('click', function() {
              // Redirect to settings page or open edit modal
              window.location.href = 'adopter-setting.html';
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