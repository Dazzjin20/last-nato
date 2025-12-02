const { Adopter } = require('../models');

class AdopterRepository {
    async create(adopterData) {
        try {
            const adopter = new Adopter({
                email: adopterData.email,
                password: adopterData.password,
                first_name: adopterData.first_name,
                last_name: adopterData.last_name,
                phone: adopterData.phone,
                living_situation: adopterData.living_situation,
                pet_experience: adopterData.pet_experience || [],
                consents: this.buildConsents(adopterData.consents || [])
            });

            return await adopter.save();
        } catch (error) {
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