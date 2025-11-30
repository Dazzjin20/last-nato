const { Volunteer } = require('../models');
const bcrypt = require('bcryptjs');

class VolunteerRepository {
    async create(volunteerData) {
        try {
            const hashedPassword = await bcrypt.hash(volunteerData.password, 10);

            const volunteer = new Volunteer({
                email: volunteerData.email,
                password: hashedPassword,
                first_name: volunteerData.first_name,
                last_name: volunteerData.last_name,
                phone: volunteerData.phone,
                availability: volunteerData.availability || [],
                activities: volunteerData.interested_activities || [],
                consents: this.buildConsents(volunteerData.consents || [])
            });

            return await volunteer.save();
        } catch (error) {
            // Handle MongoDB duplicate key error
            if (error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} already exists`);
            }
            throw new Error(`Failed to create volunteer: ${error.message}`);
        }
    }

    async findByEmail(email) {
        try {
            return await Volunteer.findOne({ email: email.toLowerCase() });
        } catch (error) {
            throw new Error(`Failed to find volunteer by email: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            return await Volunteer.findById(id);
        } catch (error) {
            throw new Error(`Failed to find volunteer by ID: ${error.message}`);
        }
    }

    async findAll(filter = {}) {
        try {
            return await Volunteer.find(filter);
        } catch (error) {
            throw new Error(`Failed to find volunteers: ${error.message}`);
        }
    }

    buildConsents(consentTypes) {
        const consentMap = {
            agreed_terms: 'Terms of Service and Privacy Policy',
            consent_background_check: 'Background Check',
            wants_updates: 'Receive Updates'
        };

        return consentTypes.map(consentType => ({
            consent_type: consentMap[consentType] || consentType,
            consented: true,
            consented_at: new Date()
        }));
    }
}

module.exports = new VolunteerRepository();