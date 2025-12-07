document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');

    // Function to fetch and display pets based on filters
    async function fetchAndDisplayPets() {
        const searchTerm = searchInput.value;
        const petType = typeFilter.value;
        const status = statusFilter.value;

        // Construct the query string
        const query = new URLSearchParams({
            search: searchTerm,
            type: petType,
            status: status,
        }).toString();

        const petListContainer = document.getElementById('petListContainer');
        petListContainer.innerHTML = '<p>Loading pets...</p>';

        try {
            const response = await fetch(`http://localhost:3000/api/pets?${query}`);
            if (!response.ok) {
                throw new Error('Failed to fetch pets.');
            }
            const pets = await response.json();

            renderPets(pets);
        } catch (error) {
            console.error('Error fetching pets:', error);
            petListContainer.innerHTML = '<p class="text-danger">Could not load pets. Please try again later.</p>';
        }
    }

    // Function to render pet cards
    function renderPets(pets) {
        const petListContainer = document.getElementById('petListContainer');
        petListContainer.innerHTML = ''; // Clear previous results

        if (pets.length === 0) {
            petListContainer.innerHTML = '<p>No pets found matching your criteria.</p>';
            return;
        }

        pets.forEach(pet => {
            const petCard = document.createElement('div');
            petCard.className = 'col-md-4 mb-4'; // Example class for a card
            // Note: This is a simplified card structure. Adapt it to your design.
            petCard.innerHTML = `
                <div class="card">
                    <img src="${pet.before_image || '/frontend/assets/image/photo/placeholder.jpg'}" class="card-img-top" alt="${pet.pet_name}">
                    <div class="card-body">
                        <h5 class="card-title">${pet.pet_name}</h5>
                        <p class="card-text">${pet.pet_type} • ${pet.breed}</p>
                        <span class="badge bg-info">${pet.adoption_status}</span>
                        <a href="/frontend/pet-details.html?id=${pet._id}" class="btn btn-primary mt-2">View Details</a>
                    </div>
                </div>
            `;
            petListContainer.appendChild(petCard);
        });
    }

    // Event Listeners for filters
    searchInput.addEventListener('input', fetchAndDisplayPets);
    typeFilter.addEventListener('change', fetchAndDisplayPets);
    statusFilter.addEventListener('change', fetchAndDisplayPets);

    // Initial load of all pets
    fetchAndDisplayPets();
});