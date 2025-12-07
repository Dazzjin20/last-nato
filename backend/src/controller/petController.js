const petRepository = require('../repositories/pet.repository');
const adopterRepository = require('../repositories/adopterRepository');

class PetController {
  async getAll(req, res) {
    try {
      const filter = {};
      if (req.query.type) filter.pet_type = req.query.type;
      if (req.query.status) filter.status = req.query.status;
      if (req.query.vaccinated) filter.vaccinated = req.query.vaccinated === 'true';

      const pets = await petRepository.findAll(filter);
      res.json({ pets });
    } catch (err) {
      console.error('Get pets error:', err);
      res.status(500).json({ message: 'Failed to get pets', error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const pet = await petRepository.findById(req.params.id);
      if (!pet) return res.status(404).json({ message: 'Pet not found' });
      res.json({ pet });
    } catch (err) {
      console.error('Get pet error:', err);
      res.status(500).json({ message: 'Failed to get pet', error: err.message });
    }
  }

  async create(req, res) {
    try {
      // Assuming posted_by_staff is sent in the request body for now.
      // In a real app, this would come from an authenticated staff user's ID.
      const petData = { ...req.body };
      // Example: if using auth middleware, you might get staffId from req.user.id
      // petData.posted_by_staff = req.user.id; 
      const pet = await petRepository.add(petData);
      res.status(201).json({ message: 'Pet created', pet });
    } catch (err) {
      console.error('Create pet error:', err);
      res.status(500).json({ message: 'Failed to create pet', error: err.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await petRepository.updateById(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Pet not found' });
      res.json({ message: 'Pet updated', pet: updated });
    } catch (err) {
      console.error('Update pet error:', err);
      res.status(500).json({ message: 'Failed to update pet', error: err.message });
    }
  }

  async remove(req, res) {
    try {
      const deleted = await petRepository.deleteById(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Pet not found' });
      res.json({ message: 'Pet deleted' });
    } catch (err) {
      console.error('Delete pet error:', err);
      res.status(500).json({ message: 'Failed to delete pet', error: err.message });
    }
  }

  async getRecommendations(req, res) {
    try {
      const { adopterId } = req.params;
      if (!adopterId) {
        return res.status(400).json({ message: 'Adopter ID is required.' });
      }

      const adopter = await adopterRepository.findById(adopterId);
      if (!adopter) {
        return res.status(404).json({ message: 'Adopter not found.' });
      }

      const allPets = await petRepository.findAll({ status: 'available' });

      const scoredPets = allPets.map(pet => {
        let score = 0;
        const petPersonalities = (pet.personality || []).map(p => p.toLowerCase());

        // Rule 1: Calm pets are good for apartments/condos
        if (['apartment', 'condominium'].includes(adopter.living_situation) && petPersonalities.includes('calm')) {
          score += 2;
        }

        // Rule 2: Friendly/Loyal pets are good for first-time owners
        if (adopter.pet_experience.includes('1st_time_owner') && (petPersonalities.includes('friendly') || petPersonalities.includes('loyal'))) {
          score += 2;
        }

        // Rule 3: Energetic/Playful pets are good for houses
        if (['own_house', 'rent_house'].includes(adopter.living_situation) && (petPersonalities.includes('energetic') || petPersonalities.includes('playful'))) {
          score += 1;
        }

        return { ...pet.toObject(), score };
      });

      // Sort by score (descending) and return top 3
      const recommendedPets = scoredPets.sort((a, b) => b.score - a.score).slice(0, 3);

      res.json({ pets: recommendedPets });
    } catch (err) {
      console.error('Get recommendations error:', err);
      res.status(500).json({ message: 'Failed to get recommendations', error: err.message });
    }
  }
}

module.exports = new PetController();
