const petRepository = require('../repositories/pet.repository');

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
      const pet = await petRepository.add(req.body);
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
}

module.exports = new PetController();
