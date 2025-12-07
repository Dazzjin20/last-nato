  // Calendar data and functions
    const calendarData = {
      currentDate: new Date(),
      selectedDate: new Date(),
      
      // Sample task data for demonstration
      tasksByDate: {
        // Tasks for today
        [new Date().toDateString()]: [
          { petName: "Joy", taskTitle: "Daily Exercise Routine", assignedTo: "Alex Morgan", time: "2:00 PM" },
          { petName: "Fear", taskTitle: "Behavioral Assessment", assignedTo: "Jamie Smith", time: "3:30 PM" }
        ],
        // Tasks for tomorrow
        [new Date(Date.now() + 86400000).toDateString()]: [
          { petName: "Sadness", taskTitle: "Vaccination", assignedTo: "Dasha Taran", time: "10:00 AM" }
        ],
        // Tasks for day after tomorrow
        [new Date(Date.now() + 172800000).toDateString()]: [
          { petName: "Anger", taskTitle: "Physical Therapy Session", assignedTo: "Kenji Webbo", time: "10:00 AM" }
        ],
        // Additional tasks for various dates
        "Sat Jan 18 2025": [
          { petName: "Disgust", taskTitle: "Grooming Session", assignedTo: "Taylor Brown", time: "11:00 AM" },
          { petName: "Surprise", taskTitle: "Socialization Training", assignedTo: "Alex Morgan", time: "2:00 PM" }
        ],
        "Mon Jan 20 2025": [
          { petName: "Sadness", taskTitle: "Follow-up Checkup", assignedTo: "Dasha Taran", time: "9:00 AM" },
          { petName: "Joy", taskTitle: "Advanced Training", assignedTo: "Alex Morgan", time: "1:00 PM" },
          { petName: "Fear", taskTitle: "Behavioral Follow-up", assignedTo: "Jamie Smith", time: "3:00 PM" }
        ]
      },
      
      // Get tasks for a specific date
      getTasksForDate(date) {
        const dateString = date.toDateString();
        return this.tasksByDate[dateString] || [];
      },
      
      // Get week dates for a given date
      getWeekDates(date) {
        const weekDates = [];
        const currentDay = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const startOfWeek = new Date(date);
        
        // Adjust to start from Monday (if you want Sunday, change to 0)
        const startAdjust = currentDay === 0 ? -6 : 1 - currentDay;
        startOfWeek.setDate(date.getDate() + startAdjust);
        
        // Generate 7 days
        for (let i = 0; i < 7; i++) {
          const dayDate = new Date(startOfWeek);
          dayDate.setDate(startOfWeek.getDate() + i);
          weekDates.push(dayDate);
        }
        
        return weekDates;
      },
      
      // Format date for display
      formatDate(date) {
        const options = { month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
      },
      
      // Check if two dates are the same day
      isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
      },
      
      // Check if date is today
      isToday(date) {
        const today = new Date();
        return this.isSameDay(date, today);
      }
    };

    // Initialize the page
    document.addEventListener('DOMContentLoaded', function() {
      // Set user info in navbar (using your existing auth logic)
      document.getElementById('navbarUserName').textContent = 'Kenji Webbo';
      document.getElementById('navbarUserRole').textContent = 'Staff Manager';
      
      // Tab switching functionality
      const tabs = {
        'overview': { 
          tab: document.getElementById('overviewTab'), 
          view: document.getElementById('overviewView') 
        },
        'tasks': { 
          tab: document.getElementById('tasksTab'), 
          view: document.getElementById('tasksView') 
        },
        'schedule': { 
          tab: document.getElementById('scheduleTab'), 
          view: document.getElementById('scheduleView') 
        }
      };
      
      // Function to switch tabs
      function switchToTab(tabName) {
        // Hide all views
        Object.values(tabs).forEach(tab => {
          if (tab.view) tab.view.style.display = 'none';
          if (tab.tab) tab.tab.classList.remove('active');
        });
        
        // Show selected view and activate tab
        if (tabs[tabName]) {
          if (tabs[tabName].view) tabs[tabName].view.style.display = 'grid';
          if (tabs[tabName].tab) tabs[tabName].tab.classList.add('active');
        }
        
        // If switching to schedule tab, update the calendar
        if (tabName === 'schedule') {
          updateCalendar();
        }
      }
      
      // Add click events to tabs
      document.getElementById('overviewTab').addEventListener('click', () => switchToTab('overview'));
      document.getElementById('tasksTab').addEventListener('click', () => switchToTab('tasks'));
      document.getElementById('scheduleTab').addEventListener('click', () => switchToTab('schedule'));
      
      // ===== OVERVIEW TAB FUNCTIONALITY =====
      
      // Overview action buttons
      const overviewViewButtons = document.querySelectorAll('#overviewView .action-btn-view');
      overviewViewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          const activityItem = this.closest('.care-activity-item');
          const petName = activityItem.querySelector('.pet-name').textContent;
          alert(`Viewing details for ${petName}'s care activity`);
        });
      });
      
      const overviewUpdateButtons = document.querySelectorAll('#overviewView .action-btn-update');
      overviewUpdateButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          const activityItem = this.closest('.care-activity-item');
          const petName = activityItem.querySelector('.pet-name').textContent;
          const currentStatus = activityItem.querySelector('.status-badge').textContent;
          
          // Simple status update simulation
          if (currentStatus === 'Pending') {
            activityItem.querySelector('.status-badge').textContent = 'In Progress';
            activityItem.querySelector('.status-badge').className = 'status-badge status-in-progress';
            alert(`${petName}'s task is now In Progress`);
          } else if (currentStatus === 'In Progress') {
            activityItem.querySelector('.status-badge').textContent = 'Completed';
            activityItem.querySelector('.status-badge').className = 'status-badge status-completed';
            this.textContent = 'Log Activity';
            alert(`${petName}'s task is now Completed`);
          } else if (currentStatus === 'Completed') {
            alert(`Logging additional activity for ${petName}`);
          }
        });
      });
      
      // ===== TASKS TAB FUNCTIONALITY =====
      
      // Tasks action buttons
      const tasksViewButtons = document.querySelectorAll('#tasksView .action-btn-view');
      tasksViewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          const taskItem = this.closest('.task-item');
          const petName = taskItem.querySelector('.pet-name').textContent;
          const taskTitle = taskItem.querySelector('.task-title').textContent;
          alert(`Viewing details for:\nPet: ${petName}\nTask: ${taskTitle}`);
        });
      });
      
      const tasksEditButtons = document.querySelectorAll('#tasksView .action-btn-edit');
      tasksEditButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          const taskItem = this.closest('.task-item');
          const petName = taskItem.querySelector('.pet-name').textContent;
          const currentStatus = taskItem.querySelector('.status-badge').textContent;
          
          if (currentStatus === 'Pending') {
            taskItem.querySelector('.status-badge').textContent = 'In Progress';
            taskItem.querySelector('.status-badge').className = 'status-badge status-in-progress';
            this.textContent = 'Update';
            alert(`${petName}'s task is now In Progress`);
          } else if (currentStatus === 'In Progress') {
            taskItem.querySelector('.status-badge').textContent = 'Completed';
            taskItem.querySelector('.status-badge').className = 'status-badge status-completed';
            this.textContent = 'Review';
            alert(`${petName}'s task is now Completed`);
          } else if (currentStatus === 'Completed') {
            alert(`Reviewing completed task for ${petName}`);
          }
        });
      });
      
      // Add Task Button functionality
      document.getElementById('addTaskBtn').addEventListener('click', function() {
        // Create a new task item
        const newTaskItem = document.createElement('article');
        newTaskItem.className = 'task-item';
        newTaskItem.innerHTML = `
          <div class="task-header">
            <div class="pet-name-section">
              <div class="pet-name">New Pet</div>
              <span class="priority-badge priority-medium">Medium</span>
            </div>
          </div>
          
          <div class="task-details">
            <div class="task-title">New Care Task</div>
            <div class="task-meta">
              <div class="task-assigned">
                <i class="fas fa-user-circle"></i>
                Assigned to You
              </div>
              <div class="task-time">
                <i class="far fa-calendar"></i>
                Just now
              </div>
            </div>
          </div>
          
          <div class="task-status-section">
            <span class="status-badge status-pending">Pending</span>
            <div class="task-actions">
              <button class="action-btn action-btn-view">View</button>
              <button class="action-btn action-btn-edit">Edit</button>
            </div>
          </div>
        `;
        
        // Add to pending section
        const pendingSection = document.querySelector('#tasksView .task-section');
        pendingSection.appendChild(newTaskItem);
        
        // Add event listeners to new buttons
        newTaskItem.querySelector('.action-btn-view').addEventListener('click', function() {
          alert('Viewing new task details');
        });
        
        newTaskItem.querySelector('.action-btn-edit').addEventListener('click', function() {
          const taskItem = this.closest('.task-item');
          const petName = taskItem.querySelector('.pet-name').textContent;
          const currentStatus = taskItem.querySelector('.status-badge').textContent;
          
          if (currentStatus === 'Pending') {
            taskItem.querySelector('.status-badge').textContent = 'In Progress';
            taskItem.querySelector('.status-badge').className = 'status-badge status-in-progress';
            this.textContent = 'Update';
            alert(`${petName}'s task is now In Progress`);
          }
        });
        
        alert('New task added successfully!');
      });
      
      // ===== SCHEDULE TAB FUNCTIONALITY =====
      
      // Calendar navigation
      document.getElementById('prevWeekBtn').addEventListener('click', function() {
        calendarData.currentDate.setDate(calendarData.currentDate.getDate() - 7);
        updateCalendar();
      });
      
      document.getElementById('nextWeekBtn').addEventListener('click', function() {
        calendarData.currentDate.setDate(calendarData.currentDate.getDate() + 7);
        updateCalendar();
      });
      
      // Update calendar display
      function updateCalendar() {
        const weekDates = calendarData.getWeekDates(calendarData.currentDate);
        const today = new Date();
        
        // Update month/year display
        document.getElementById('calendarMonthYear').textContent = calendarData.formatDate(calendarData.currentDate);
        
        // Update week days header
        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        let weekDaysHTML = '';
        weekDays.forEach(day => {
          weekDaysHTML += `<div class="week-day">${day}</div>`;
        });
        document.getElementById('weekDaysHeader').innerHTML = weekDaysHTML;
        
        // Update week dates grid
        let weekDatesHTML = '';
        weekDates.forEach(date => {
          const tasks = calendarData.getTasksForDate(date);
          const taskCount = tasks.length;
          const isToday = calendarData.isToday(date);
          const isSelected = calendarData.isSameDay(date, calendarData.selectedDate);
          const isCurrentMonth = date.getMonth() === calendarData.currentDate.getMonth();
          
          let dateClass = 'week-date';
          if (isToday) dateClass += ' today';
          if (isSelected) dateClass += ' selected';
          if (!isCurrentMonth) dateClass += ' other-month';
          
          weekDatesHTML += `
            <div class="${dateClass}" data-date="${date.toDateString()}">
              <div class="date-number">${date.getDate()}</div>
              <div class="date-tasks">${taskCount > 0 ? `${taskCount} task${taskCount !== 1 ? 's' : ''}` : ''}</div>
            </div>
          `;
        });
        document.getElementById('weekDatesGrid').innerHTML = weekDatesHTML;
        
        // Update tasks list for selected date
        updateTasksList();
        
        // Add click events to dates
        document.querySelectorAll('.week-date').forEach(dateEl => {
          dateEl.addEventListener('click', function() {
            const dateString = this.getAttribute('data-date');
            calendarData.selectedDate = new Date(dateString);
            
            // Update calendar to show selected date
            calendarData.currentDate = new Date(calendarData.selectedDate);
            updateCalendar();
          });
        });
      }
      
      // Update tasks list for selected date
      function updateTasksList() {
        const tasks = calendarData.getTasksForDate(calendarData.selectedDate);
        const today = new Date();
        const isToday = calendarData.isToday(calendarData.selectedDate);
        
        let tasksHTML = '';
        
        if (tasks.length > 0) {
          tasks.forEach(task => {
            // Calculate time display
            let timeDisplay = task.time;
            if (isToday) {
              timeDisplay = `Today ${task.time}`;
            } else {
              const dayDiff = Math.floor((calendarData.selectedDate - today) / (1000 * 60 * 60 * 24));
              if (dayDiff === 1) {
                timeDisplay = `Tomorrow ${task.time}`;
              } else if (dayDiff > 1) {
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const dayName = days[calendarData.selectedDate.getDay()];
                timeDisplay = `${dayName} ${task.time}`;
              }
            }
            
            tasksHTML += `
              <article class="upcoming-task-item">
                <div class="upcoming-task-header">
                  <div class="upcoming-pet-name">${task.petName}</div>
                  <div class="upcoming-task-time">${timeDisplay}</div>
                </div>
                
                <div class="upcoming-task-details">
                  <div class="upcoming-task-title">${task.taskTitle}</div>
                  <div class="task-meta">
                    <div class="task-assigned">
                      <i class="fas fa-user-circle"></i>
                      Assigned to ${task.assignedTo}
                    </div>
                  </div>
                </div>
              </article>
            `;
          });
        } else {
          tasksHTML = `
            <div style="text-align: center; padding: 2rem; color: #666; font-style: italic;">
              No tasks scheduled for this date
            </div>
          `;
        }
        
        document.getElementById('upcomingTasksList').innerHTML = tasksHTML;
      }
      
      // Initialize with Overview tab active
      switchToTab('overview');
    });