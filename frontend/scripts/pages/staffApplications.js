document.addEventListener('DOMContentLoaded', () => {
    // Initially, show 'Pending' applications
    loadAndRenderApplications('Pending');
    setupFilterButtons();
});

let currentApplications = []; // Cache for the currently displayed applications

async function loadAndRenderApplications(statusFilter = 'Pending') {
    const tableBody = document.getElementById('applications-table-body'); // Make sure this ID exists in your HTML
    tableBody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center p-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </td>
        </tr>`;

    try {
        // Pass the status filter as a query parameter to the backend
        const response = await fetch(`http://localhost:3000/api/applications?status=${statusFilter}`);
        if (!response.ok) throw new Error('Failed to fetch applications.');

        const data = await response.json();
        currentApplications = data.applications || [];
        renderApplications(currentApplications, statusFilter);

    } catch (error) {
        console.error('Error loading applications:', error);
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">${error.message}</td></tr>`;
    }
}

function renderApplications(applications, statusFilter) {
    const tableBody = document.getElementById('applications-table-body');
    tableBody.innerHTML = '';

    if (applications.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center p-4">No applications with status "${statusFilter}".</td></tr>`;
        return;
    }

    applications.forEach(app => {
        const row = tableBody.insertRow();
        const submittedDate = new Date(app.date_submitted).toLocaleDateString();
        
        const statusColors = {
            'Pending': 'warning',
            'Approved': 'success',
            'Interview Scheduled': 'info text-dark',
            'Rejected': 'danger',
            'Adopted': 'primary'
        };
        const statusColor = statusColors[app.status] || 'secondary';

        row.innerHTML = `
            <td>${app.application_id}</td>
            <td>${app.pet_name}</td>
            <td>${app.adopter_first_name || 'N/A'} ${app.adopter_last_name || ''}</td>
            <td>${submittedDate}</td>
            <td><span class="badge bg-${statusColor}">${app.status}</span></td>
            <td>
                <a href="staff-review-application.html?id=${app.application_id}" 
                   class="btn btn-sm btn-outline-primary view-details-btn"
                   title="View Details">
                    <i class="fa-solid fa-eye"></i>
                </a>
            </td>
        `;
    });
}

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('[data-status-filter]');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state for buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const status = button.dataset.statusFilter;
            loadAndRenderApplications(status);
        });
    });
}