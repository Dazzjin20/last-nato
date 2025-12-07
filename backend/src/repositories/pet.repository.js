const { Pet } = require('../models/base/infoPetSchema');

class PetRepository {
    async add(petData) {
        try {
            const pet = new Pet({
                after_image: petData.after_image,
                before_image: petData.before_image,
                pet_name: petData.pet_name,
                age: petData.age,
                weight: petData.weight,
                status: petData.status,
                pet_type: petData.pet_type,
                sex: petData.sex,
                arrival_date: petData.arrival_date,
                location: petData.location,
                vaccinated: petData.vaccinated,
                personality: petData.personality,
                about_pet: petData.about_pet,
                posted_by_staff: petData.posted_by_staff, // Save the staff ID
          
            });

            return await pet.save();
        } catch (error) {
            throw new Error(`Failed to add pet: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            return await Pet.findById(id).populate('posted_by_staff'); // Populate staff details
        } catch (error) {
            throw new Error(`Failed to find pet by ID: ${error.message}`);
        }
    }

    async findAll(filter = {}) {
        try {
            return await Pet.find(filter).populate('posted_by_staff'); // Populate staff details
        } catch (error) {
            throw new Error(`Failed to find pets: ${error.message}`);
        }
    }

    async updateById(id, updateData) {
        try {
            return await Pet.findByIdAndUpdate(id, { $set: updateData }, { new: true });
        } catch (error) {
            throw new Error(`Failed to update pet: ${error.message}`);
        }
    }

    async deleteById(id) {
        try {
            return await Pet.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Failed to delete pet: ${error.message}`);
        }
    }
}

module.exports = new PetRepository();