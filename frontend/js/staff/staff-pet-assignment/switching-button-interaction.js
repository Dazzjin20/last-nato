 document.addEventListener('DOMContentLoaded', function() {
      const petAssignmentsBtn = document.getElementById('pet-assignments-button');
      const volunteerCapacityBtn = document.getElementById('volunteer-capacity-button');
      const petAssignmentsSection = document.getElementById('pet-assignments-section');
      const volunteerCapacitySection = document.getElementById('volunteer-capacity-section');
      
      // Set initial state
      petAssignmentsBtn.classList.add('staff-view-dashboard-btn', 'text-white');
      volunteerCapacityBtn.classList.add('staff-quick-btn', 'text-primary');
      
      // Pet Assignments button click
      petAssignmentsBtn.addEventListener('click', function() {
        // Update button styles
        petAssignmentsBtn.classList.remove('staff-quick-btn', 'text-primary');
        petAssignmentsBtn.classList.add('staff-view-dashboard-btn', 'text-white');
        
        volunteerCapacityBtn.classList.remove('staff-view-dashboard-btn', 'text-white');
        volunteerCapacityBtn.classList.add('staff-quick-btn', 'text-primary');
        
        // Switch sections
        petAssignmentsSection.style.display = 'block';
        volunteerCapacitySection.style.display = 'none';
      });
      
      // Volunteer Capacity button click
      volunteerCapacityBtn.addEventListener('click', function() {
        // Update button styles
        volunteerCapacityBtn.classList.remove('staff-quick-btn', 'text-primary');
        volunteerCapacityBtn.classList.add('staff-view-dashboard-btn', 'text-white');
        
        petAssignmentsBtn.classList.remove('staff-view-dashboard-btn', 'text-white');
        petAssignmentsBtn.classList.add('staff-quick-btn', 'text-primary');
        
        // Switch sections
        volunteerCapacitySection.style.display = 'block';
        petAssignmentsSection.style.display = 'none';
      });
    });