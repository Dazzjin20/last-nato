    // Initialize the page
    document.addEventListener('DOMContentLoaded', function() {
      // Set current date for due date field
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Format date as mm/dd/yyyy
      const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const day = String(tomorrow.getDate()).padStart(2, '0');
      const year = tomorrow.getFullYear();
      const formattedDate = `${month}/${day}/${year}`;
      
      document.getElementById('taskDueDate').value = formattedDate;
      
      // Set user info in navbar (using your existing auth logic)
      document.getElementById('navbarUserName').textContent = 'Kenji Webbo';
      document.getElementById('navbarUserRole').textContent = 'Staff Manager';
      
      // Priority selection
      const priorityBadges = document.querySelectorAll('.priority-badge');
      priorityBadges.forEach(badge => {
        badge.addEventListener('click', function() {
          priorityBadges.forEach(b => b.classList.remove('active'));
          this.classList.add('active');
        });
      });
      
      // Task type selection
      const typeBadges = document.querySelectorAll('.task-type-badge');
      typeBadges.forEach(badge => {
        badge.addEventListener('click', function() {
          if (!this.closest('.priority-badge')) { // Don't toggle priority badges
            typeBadges.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
          }
        });
      });
      
      // Create Task Button Handler
      document.getElementById('saveTaskBtn').addEventListener('click', function() {
        const taskTitle = document.getElementById('taskTitle').value;
        const taskLocation = document.getElementById('taskLocation').value;
        
        if (taskTitle.trim() === '') {
          alert('Please enter a task title');
          return;
        }
        
        if (taskLocation.trim() === '') {
          alert('Please enter a location');
          return;
        }
        
        // Get selected priority
        const selectedPriority = document.querySelector('.priority-badge.active').textContent;
        
        // Get form values
        const taskData = {
          title: taskTitle,
          description: document.getElementById('taskDescription').value,
          estimatedHours: document.getElementById('taskEstimatedHours').value,
          points: document.getElementById('taskPoints').value,
          dueDate: document.getElementById('taskDueDate').value,
          location: taskLocation,
          priority: selectedPriority,
          type: 'Special',
          category: 'Facilities'
        };
        
        // In a real app, this would save to a backend
        alert(`Task "${taskTitle}" created successfully!\nPriority: ${selectedPriority}\nPoints: ${taskData.points}\nDue: ${taskData.dueDate}`);
        
        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('createTaskModal'));
        modal.hide();
        
        // Reset form
        document.getElementById('createTaskForm').reset();
        document.getElementById('taskDueDate').value = formattedDate;
        document.getElementById('taskEstimatedHours').value = 1;
        document.getElementById('taskPoints').value = 25;
        
        // Reset active states
        priorityBadges.forEach(badge => {
          badge.classList.remove('active');
          if (badge.classList.contains('priority-medium')) {
            badge.classList.add('active');
          }
        });
        
        typeBadges.forEach(badge => {
          badge.classList.remove('active');
          if (badge.textContent.trim() === 'Special') {
            badge.classList.add('active');
          }
        });
      });
      
      // Assign Volunteer Button Handler
      document.getElementById('assignBtn').addEventListener('click', function() {
        const volunteerSelect = document.getElementById('volunteerSelect');
        const selectedVolunteer = volunteerSelect.options[volunteerSelect.selectedIndex].text;
        
        if (volunteerSelect.value === 'Choose a volunteer...') {
          alert('Please select a volunteer');
          return;
        }
        
        // Update the task assignment
        updateTaskAssignment(selectedVolunteer);
        
        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('assignVolunteerModal'));
        modal.hide();
        
        // Reset select
        volunteerSelect.selectedIndex = 0;
      });
      
      // Quick Assign Buttons for available volunteers
      const quickAssignBtns = document.querySelectorAll('.quick-assign-btn');
      quickAssignBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          const volunteerName = this.getAttribute('data-volunteer');
          updateTaskAssignment(volunteerName);
        });
      });
      
      // Function to update task assignment UI
      function updateTaskAssignment(volunteerInfo) {
        const unassignedTask = document.querySelector('.task-unassigned');
        
        if (unassignedTask) {
          // Extract volunteer name from the string (remove availability info)
          const volunteerName = volunteerInfo.split(' (')[0];
          
          // Update the UI
          unassignedTask.classList.remove('task-unassigned');
          unassignedTask.querySelector('.status-unassigned').textContent = 'Assigned';
          unassignedTask.querySelector('.status-unassigned').classList.remove('status-unassigned');
          unassignedTask.querySelector('.status-unassigned').classList.add('status-assigned');
          
          // Update the assign button
          const assignBtn = unassignedTask.querySelector('.assign-volunteer-btn');
          assignBtn.textContent = 'Reassign';
          
          // Add volunteer info
          const volunteerDiv = document.createElement('div');
          volunteerDiv.className = 'd-flex align-items-center me-3';
          volunteerDiv.innerHTML = `
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(volunteerName)}&background=667eea&color=fff" 
                 alt="${volunteerName}" class="volunteer-avatar me-2">
            <span>${volunteerName}</span>
          `;
          
          // Insert volunteer info before the status badge
          const taskActions = unassignedTask.querySelector('.col-md-6 .d-flex');
          taskActions.insertBefore(volunteerDiv, taskActions.querySelector('.status-badge'));
          
          // Update statistics
          updateTaskStats();
          
          alert(`Task assigned to ${volunteerName}`);
        } else {
          alert('No unassigned tasks available');
        }
      }
      
      // Function to update task statistics
      function updateTaskStats() {
        const assignedTasksElement = document.querySelectorAll('.staff-stat-card')[1].querySelector('.stats-number');
        const unassignedTasksElement = document.querySelectorAll('.staff-stat-card')[2].querySelector('.stats-number');
        
        let assignedCount = parseInt(assignedTasksElement.textContent);
        let unassignedCount = parseInt(unassignedTasksElement.textContent);
        
        assignedTasksElement.textContent = assignedCount + 1;
        unassignedTasksElement.textContent = unassignedCount - 1;
      }
    });