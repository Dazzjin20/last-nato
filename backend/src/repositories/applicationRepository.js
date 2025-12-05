const Application = require('../models/application.Schema');
const Counter = require('../models/counter.Schema'); 
const { Pet } = require('../models/base/infoPetSchema');
const { Adopter } = require('../models');

class ApplicationRepository{
    async submit(applicationData){
        const newApplicationId = await this.generateNextID();
        
        try{
            // Fetch Pet details
            const pet = await Pet.findById(applicationData.pet);
            if (!pet) {
                throw new Error('Pet not found.');
            }

            // Fetch Adopter details
            const adopter = await Adopter.findById(applicationData.adopter);
            if (!adopter) {
                throw new Error('Adopter not found.');
            }

            const newApplication = new Application({
                application_id: newApplicationId,
                pet: applicationData.pet,
                adopter: applicationData.adopter,
                
                // Populate pet details from fetched pet
                pet_name: pet.pet_name,
                pet_gender: pet.sex, // Assuming pet.sex maps to pet_gender

                // Populate adopter details from fetched adopter
                adopter_first_name: adopter.first_name,
                adopter_last_name: adopter.last_name,
                adopter_contact_no: adopter.phone, // Assuming adopter.phone maps to contact_no

                message: applicationData.message, // Adopter's message
                status: 'Pending', // Default status
                date_submitted: new Date(),
                last_update: new Date(),
                
                // Staff-managed fields are initially empty
                interview_date: null,
                interview_time: null,
                next_step: null,
                staff_notes: null,
            });

            return await newApplication.save();
        }catch(error){
             throw new Error(`Failed to submit application: ${error.message}`);
        }
    }

    async generateNextID(){
        const counter = await Counter.findOneAndUpdate(
            { _id: 'applicationId' }, // Use a specific ID for the application counter
            { $inc: { seq: 1 } },
            { new: true, upsert: true } // Create if not exists, return new value
        );
        const currentYear = new Date().getFullYear();
        const sequenceNumber = String(counter.seq).padStart(3, '0');
        return `APP-${currentYear}-${sequenceNumber}`;
    }

    async findById(applicationId) {
        try {
            // Find by the custom application_id string or by MongoDB's _id
            const query = mongoose.Types.ObjectId.isValid(applicationId) 
                ? { _id: applicationId } 
                : { application_id: applicationId };
            return await Application.findOne(query).populate('pet').populate('adopter');
        } catch (error) {
            throw new Error(`Failed to find application: ${error.message}`);
        }
    }

    async findAllForAdopter(adopterId) {
        try {
            return await Application.find({ adopter: adopterId }).populate('pet').sort({ date_submitted: -1 });
        } catch (error) {
            throw new Error(`Failed to find applications for adopter: ${error.message}`);
        }
    }
}
module.exports = {
    ApplicationRepository
}