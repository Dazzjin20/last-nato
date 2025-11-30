const { Staff } = require('../models');
const bcrypt = require('bcryptjs');

class StaffRepository {
    async create(staffData) {
        try {
            const hashedPassword = await bcrypt.hash(staffData.password, 10);

            const staff = new Staff({
                email: staffData.email,
                password: hashedPassword,
                first_name: staffData.first_name,
                last_name: staffData.last_name,
                phone: staffData.phone,
                role: staffData.role || 'coordinator',
                department: staffData.department || 'administration',
                consents: this.buildConsents(staffData.consents || [])
            });

            return await staff.save();
        } catch (error) {
            // Handle MongoDB duplicate key error
            if (error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} already exists`);
            }
            throw new Error(`Failed to create staff: ${error.message}`);
        }
    }

    async findByEmail(email) {
        try {
            return await Staff.findOne({ email: email.toLowerCase() });
        } catch (error) {
            throw new Error(`Failed to find staff by email: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            return await Staff.findById(id);
        } catch (error) {
            throw new Error(`Failed to find staff by ID: ${error.message}`);
        }
    }

    async findAll(filter = {}) {
        try {
            return await Staff.find(filter);
        } catch (error) {
            throw new Error(`Failed to find staff: ${error.message}`);
        }
    }

    buildConsents(consentTypes) {
        const consentMap = {
            agreed_terms: 'Terms of Service and Privacy Policy',
            consents_background_check: 'Background Check',
            wants_updates: 'Receive Updates'
        };

        return consentTypes.map(consentType => ({
            consent_type: consentMap[consentType] || consentType,
            consented: true,
            consented_at: new Date()
        }));
    }
}

module.exports = new StaffRepository();