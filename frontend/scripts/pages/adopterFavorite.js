document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'adopter') {
        document.getElementById('favoritePetListContainer').innerHTML = '<p class="text-danger">You must be logged in as an adopter to see favorites.</p>';
        return;
    }

    const searchInput = document.getElementById('favSearchInput');
    const typeFilter = document.getElementById('favTypeFilter');
    const container = document.getElementById('favoritePetListContainer');

    let allFavoritePets = []; // To store the full pet data for client-side filtering

    // 1. Load favorite pets from the server
    async function loadFavoritePets() {
        const favoritesKey = `favorites_${currentUser._id}`;
        const favoriteIds = JSON.parse(localStorage.getItem(favoritesKey)) || [];

        if (favoriteIds.length === 0) {
            container.innerHTML = '<p>You have not favorited any pets yet.</p>';
            return;
        }

        try {
            // We need an endpoint that accepts a list of IDs
            const response = await fetch(`http://localhost:3000/api/pets/by-ids`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: favoriteIds }),
            });

            if (!response.ok) throw new Error('Failed to fetch favorite pet details.');

            allFavoritePets = await response.json();
            renderFilteredPets(); // Render all favorites initially
        } catch (error) {
            console.error('Error loading favorite pets:', error);
            container.innerHTML = '<p class="text-danger">Could not load your favorites.</p>';
        }
    }

    // 2. Render pets based on current filter values
    function renderFilteredPets() {
        const searchTerm = searchInput.value.toLowerCase();
        const petType = typeFilter.value;

        // Filter the `allFavoritePets` array
        const filteredPets = allFavoritePets.filter(pet => {
            const matchesSearch = pet.pet_name.toLowerCase().includes(searchTerm);
            const matchesType = !petType || pet.pet_type === petType;
            return matchesSearch && matchesType;
        });

        renderPets(filteredPets);
    }

    // 3. Generic function to render pet cards into the container
    function renderPets(pets) {
        container.innerHTML = ''; // Clear previous results

        if (pets.length === 0) {
            container.innerHTML = '<p>No favorite pets match your criteria.</p>';
            return;
        }

        pets.forEach(pet => {
            const petCard = document.createElement('div');
            petCard.className = 'col-md-4 mb-4'; // Example class
            // Adapt this card structure to your design
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
            container.appendChild(petCard);
        });
    }

    // Add event listeners
    searchInput.addEventListener('input', renderFilteredPets);
    typeFilter.addEventListener('change', renderFilteredPets);

    // Initial load
    loadFavoritePets();
});
