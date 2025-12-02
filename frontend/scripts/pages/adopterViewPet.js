import { getPets } from '../utils/staffPetsApi.js';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('id');

    if (!petId) {
        document.body.innerHTML = '<div class="container mt-5"><h1>Pet not found</h1><p>No pet ID was provided in the URL.</p><a href="/frontend/pages/adopters/adopter-pet.html">Go back to pets list</a></div>';
        return;
    }

    loadPetDetails(petId);
});

async function loadPetDetails(id) {
    try {
        const data = await getPets(); // Assuming getPets can fetch all pets
        const pet = (data.pets || []).find(p => p._id === id);

        if (!pet) {
            throw new Error('Pet not found');
        }

        populatePetDetails(pet);
        attachActionHandlers(pet);

    } catch (err) {
        console.error('Failed to load pet details:', err);
        document.getElementById('petNameHeader').textContent = 'Error';
        document.getElementById('petAbout').textContent = `Could not load pet details: ${err.message}`;
    }
}

function populatePetDetails(pet) {
    // Header
    document.getElementById('petNameHeader').textContent = pet.pet_name;
    document.title = `${pet.pet_name} - Pet Profile`;
    document.getElementById('petSubHeader').textContent = `${pet.age || 'N/A'} • ${pet.sex || 'N/A'}`;

    // Header Tags
    const tagsHeader = document.getElementById('petTagsHeader');
    tagsHeader.innerHTML = '';
    if (pet.status) {
        const statusTag = document.createElement('span');
        statusTag.className = 'tag';
        statusTag.textContent = pet.status;
        tagsHeader.appendChild(statusTag);
    }
    if (pet.vaccinated) {
        const vaccinatedTag = document.createElement('span');
        vaccinatedTag.className = 'tag';
        vaccinatedTag.textContent = 'Vaccinated';
        tagsHeader.appendChild(vaccinatedTag);
    }

    // Images
    document.getElementById('beforeImage').src = pet.before_image || '/frontend/assets/image/photo/placeholder.jpg';
    document.getElementById('afterImage').src = pet.after_image || '/frontend/assets/image/photo/placeholder.jpg';

    // Basic Info
    document.getElementById('petInfoAge').textContent = pet.age || 'N/A';
    document.getElementById('petInfoWeight').textContent = pet.weight ? `${pet.weight} kg` : 'N/A';
    document.getElementById('petInfoSex').textContent = pet.sex || 'N/A';
    document.getElementById('petInfoLocation').textContent = pet.location || 'N/A';
    document.getElementById('petInfoArrival').textContent = `Arrived ${pet.arrival_date || 'N/A'}`;

    // Personality & About
    const personalityContainer = document.getElementById('petPersonalityTags');
    personalityContainer.innerHTML = '';
    (pet.personality || []).forEach(trait => {
        const traitTag = document.createElement('span');
        traitTag.className = 'trait-tag';
        traitTag.textContent = trait;
        personalityContainer.appendChild(traitTag);
    });

    document.getElementById('petAboutTitle').textContent = `About ${pet.pet_name}`;
    document.getElementById('petAbout').textContent = pet.about_pet || 'No description provided.';
}

function attachActionHandlers(pet) {
    const favoriteBtn = document.getElementById('favoriteBtn');
    const applyBtn = document.getElementById('applyToAdoptBtn');

    // Favorite button functionality
    if (favoriteBtn) {
        // Check localStorage if this pet is already favorited
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (favorites.includes(pet._id)) {
            favoriteBtn.classList.add('favorited');
        }

        favoriteBtn.addEventListener('click', () => {
            favoriteBtn.classList.toggle('favorited');
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            if (favoriteBtn.classList.contains('favorited')) {
                // Add to favorites if not already there
                if (!favorites.includes(pet._id)) {
                    favorites.push(pet._id);
                }
            } else {
                // Remove from favorites
                favorites = favorites.filter(id => id !== pet._id);
            }
            localStorage.setItem('favorites', JSON.stringify(favorites));
        });
    }

    // Apply to Adopt button functionality
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            alert(`You are applying to adopt ${pet.pet_name}! This feature is under development.`);
            // Future implementation: window.location.href = `/apply.html?petId=${pet._id}`;
        });
    }
}