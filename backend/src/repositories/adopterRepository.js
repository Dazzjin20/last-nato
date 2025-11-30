const { Adopter } = require('../models');
const bcrypt = require('bcryptjs');


class AdopterRepository {
    async create(adopterData) {
        try {
            const hashedPassword = await bcrypt.hash(adopterData.password, 10);

            const adopter = new Adopter({
                email: adopterData.email,
                password: hashedPassword,
                first_name: adopterData.first_name,
                last_name: adopterData.last_name,
                phone: adopterData.phone,
                living_situation: adopterData.living_situation,
                pet_experience: adopterData.pet_experience || [],
                consents: this.buildConsents(adopterData.consents || [])
            });

            return await adopter.save();
        } catch (error) {
            // Handle MongoDB duplicate key error
            if (error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} already exists`);
            }
            throw new Error(`Failed to create adopter: ${error.message}`);
        }
    }

    async findByEmail(email) {
        try {
            return await Adopter.findOne({ email: email.toLowerCase() });
        } catch (error) {
            throw new Error(`Failed to find adopter by email: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            return await Adopter.findById(id);
        } catch (error) {
            throw new Error(`Failed to find adopter by ID: ${error.message}`);
        }
    }

    async findAll(filter = {}) {
        try {
            return await Adopter.find(filter);
        } catch (error) {
            throw new Error(`Failed to find adopters: ${error.message}`);
        }
    }

    buildConsents(consentTypes) {
        const consentMap = {
            terms_agreed: 'Terms of Service and Privacy Policy',
            background_check: 'Background Check',
            receive_updates: 'Receive Updates'
        };

        return consentTypes.map(consentType => ({
            consent_type: consentMap[consentType] || consentType,
            consented: true,
            consented_at: new Date()
        }));
    }
}

module.exports = new AdopterRepository();