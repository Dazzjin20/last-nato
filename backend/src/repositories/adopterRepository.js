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
                consents: this.buildConsents(adopterData.consents || []),
                role: adopterData.role || 'adopter',
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

    async updateById(id, updateData) {
        try {
            // Hanapin at i-update ang adopter, at ibalik ang bagong document
            // Ang { new: true } option ay tinitiyak na ang updated document ang ibabalik
            const adopter = await Adopter.findByIdAndUpdate(id, { $set: updateData }, { new: true });
            if (adopter) adopter.password = undefined; // Huwag ibalik ang password
            return adopter;
        } catch (error) {
            throw new Error(`Failed to update adopter by ID: ${error.message}`);
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