const { Volunteer } = require('../models');

class VolunteerRepository {
    async create(volunteerData) {
        try {
            const volunteer = new Volunteer({
                email: volunteerData.email,
                password: volunteerData.password,
                first_name: volunteerData.first_name,
                last_name: volunteerData.last_name,
                phone: volunteerData.phone,
                availability: volunteerData.availability || [],
                activities: volunteerData.interested_activities || [],
                consents: this.buildConsents(volunteerData.consents || []),
                role: volunteerData.role || 'volunteer'
            });

            return await volunteer.save();
        } catch (error) {   
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

    async findAll() {
        try {
            return await Volunteer.find({ status: 'active' }).select('-password -consents');
        } catch (error) {
            throw new Error(`Failed to find all volunteers: ${error.message}`);
        }
    }

    /**
     * Finds volunteers available at the current time.
     */
    async findAvailable() {
        try {
            const allVolunteers = await this.findAll();
            const now = new Date();
            const currentDay = now.toLocaleString('en-US', { weekday: 'long' }); // e.g., "Monday"
            const currentHour = now.getHours();

            const isWeekend = ['Saturday', 'Sunday'].includes(currentDay);
            const isWeekday = !isWeekend;
            const isMorning = currentHour >= 6 && currentHour < 12;
            const isNight = currentHour >= 18 && currentHour < 24;

            return allVolunteers.filter(v => {
                if (!v.availability || v.availability.length === 0) {
                    return false; // Not available if no schedule is set
                }
                const availability = v.availability.map(a => a.toLowerCase());

                const dayMatch = (isWeekday && availability.includes('weekdays')) || (isWeekend && availability.includes('weekend'));
                const timeMatch = (isMorning && availability.includes('morning')) || (isNight && availability.includes('night'));

                return dayMatch || timeMatch; // Available if day or time matches their preference
            });

        } catch (error) {
            throw new Error(`Failed to find available volunteers: ${error.message}`);
        }
    }
}

module.exports = new VolunteerRepository();