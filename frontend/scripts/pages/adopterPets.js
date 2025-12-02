import { getPets } from '../utils/staffPetsApi.js';

/**
 * Creates an HTML card for a single pet.
 * @param {object} pet The pet object from the API.
 * @returns {HTMLDivElement} The pet card element.
 */
function createPetCard(pet) {
    const col = document.createElement('div');
    col.className = 'col-md-6';

    const statusBadge = getStatusBadge(pet.status);
    const vaccinatedBadge = pet.vaccinated ? '<span class="badge bg-primary">Vaccinated</span>' : '';

    col.innerHTML = `
        <div class="adopter-pet-card">
            <img src="${pet.before_image || '/frontend/assets/image/photo/placeholder.jpg'}" class="adopter-pet-card-img" alt="${pet.pet_name}">
            <div class="adopter-pet-card-body">
                <div class="adopter-pet-name">${pet.pet_name}</div>
                <div class="adopter-pet-info">${pet.age || 'N/A'} – ${pet.sex || 'N/A'}</div>
                <div class="adopter-pet-location">${pet.location || 'N/A'}</div>
                <div class="adopter-pet-arrival">Arrived ${pet.arrival_date || 'N/A'}</div>
                <div class="adopter-pet-badges">
                    ${statusBadge}
                    ${vaccinatedBadge}
                </div>
                <div class="d-flex align-items-center gap-2 mt-3">
                    <button class="btn adopter-pet-btn flex-grow-1" onclick="viewPetDetails('${pet._id}')">View Details</button>
                    <button class="btn adopter-pet-secondary-btn flex-grow-1">Apply to Adopt</button>
                    <i class="fa-regular fa-heart favorite-icon" title="Add to Favorites"></i>
                </div>
            </div>

            </div>
        </div>
    `;
    return col;
}

/**
 * Generates a Bootstrap badge based on pet status.
 * @param {string} status The status of the pet.
 * @returns {string} HTML string for the badge.
 */
function getStatusBadge(status) {
    const s = (status || '').toLowerCase();
    switch (s) {
        case 'available':
            return '<span class="badge bg-success">Available</span>';
        case 'pending':
            return '<span class="badge bg-warning text-dark">Pending</span>';
        case 'adopted':
            return '<span class="badge bg-info">Adopted</span>';
        case 'medical':
            return '<span class="badge bg-danger">Medical</span>';
        default:
            return `<span class="badge bg-secondary">${status}</span>`;
    }
}

/**
 * Fetches pets based on current filter values and renders them.
 */
async function applyFiltersAndLoadPets() {
    const name = document.getElementById('searchPetName').value.trim();
    const type = document.getElementById('filterPetType').value;
    const status = document.getElementById('filterPetStatus').value;
    const vaccinated = document.getElementById('vaccinatedCheck').checked ? 'true' : undefined;
    const grid = document.getElementById('petsGrid');

    if (!grid) return;
    grid.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';

    const params = {};
    if (name) params.name = name;
    if (type && type !== 'All Types') params.type = type;
    if (status && status !== 'All Status') params.status = status;
    if (vaccinated) params.vaccinated = vaccinated;

    try {
        const data = await getPets(params);
        const pets = data.pets || [];
        grid.innerHTML = ''; // Clear spinner

        if (pets.length === 0) {
            grid.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No pets found matching your criteria.</p></div>';
        } else {
            pets.forEach(pet => grid.appendChild(createPetCard(pet)));
        }
    } catch (err) {
        console.error('Failed to load pets with filters:', err);
        grid.innerHTML = `<div class="col-12"><div class="alert alert-danger">Failed to load pets. ${err.message}</div></div>`;
    }
}

/**
 * Sets up event listeners for the filter controls.
 */
function setupFilterListeners() {
    const applyBtn = document.getElementById('applyFiltersBtn');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyFiltersAndLoadPets);
    }

    // Optional: Add listeners for live filtering as the user types or selects
    document.getElementById('searchPetName').addEventListener('input', (e) => {
        // Debounce to avoid too many API calls
        clearTimeout(e.target.debounce);
        e.target.debounce = setTimeout(applyFiltersAndLoadPets, 500);
    });
    document.getElementById('filterPetType').addEventListener('change', applyFiltersAndLoadPets);
    document.getElementById('filterPetStatus').addEventListener('change', applyFiltersAndLoadPets);
    document.getElementById('vaccinatedCheck').addEventListener('change', applyFiltersAndLoadPets);
}

// Make viewPetDetails globally accessible for the inline onclick
window.viewPetDetails = (petId) => {
    // Redirect to the new adopter-specific pet view page.
    window.location.href = `/frontend/pages/adopters/adopter-view-pet.html?id=${petId}`;
};

// Initial load when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    applyFiltersAndLoadPets(); // Load all pets initially
    setupFilterListeners();
});