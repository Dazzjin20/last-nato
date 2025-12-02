document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const body = document.body;

    // Determine the required role from a data attribute on the body tag
    const requiredRole = body.dataset.requiredRole;

    // If a role is required for this page
    if (requiredRole) {
        // 1. Check if a user is logged in
        if (!currentUser) {
            alert('You must be logged in to view this page.');
            window.location.href = '/frontend/pages/login-form.html';
            return;
        }

        // 2. Check if the logged-in user has the correct role
        if (currentUser.role !== requiredRole) {
            alert(`Access Denied. This page is for ${requiredRole}s only.`);
            // Clear the invalid session and redirect to login
            localStorage.removeItem('currentUser');
            window.location.href = '/frontend/pages/login-form.html';
            return;
        }
    }

    // If the user is logged in and has the correct role, populate the navbar
    if (currentUser) {
        const userFullName = `${currentUser.first_name} ${currentUser.last_name}`;
        const userRole = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);

        // Generic IDs for navbar elements
        const navbarUserName = document.getElementById('navbarUserName');
        const navbarUserRole = document.getElementById('navbarUserRole');
        const dropdownUserName = document.getElementById('dropdownUserName');
        const dropdownUserRole = document.getElementById('dropdownUserRole');
        const profileImage = document.querySelector('.profile-image'); // A generic class for profile pics

        if (navbarUserName) navbarUserName.textContent = userFullName;
        if (navbarUserRole) navbarUserRole.textContent = userRole;
        if (dropdownUserName) dropdownUserName.textContent = userFullName;
        if (dropdownUserRole) dropdownUserRole.textContent = userRole;

        // Update profile picture if element exists
        if (profileImage) {
            profileImage.src = currentUser.profile_image || '/frontend/assets/image/photo/BoyIcon.jpg';
            profileImage.onerror = () => { profileImage.src = '/frontend/assets/image/photo/BoyIcon.jpg'; };
        } 
    }
});