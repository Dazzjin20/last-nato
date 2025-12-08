const { Volunteer } = require('../models/index');

// @desc    Get available volunteers based on current time
// @route   GET /api/volunteers/available
const getAvailableVolunteers = async (req, res) => {
    try {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
        const hour = now.getHours(); // 0-23

        let availabilityQuery = ['anytime'];

        // Check for weekdays (Monday-Friday)
        if (dayOfWeek >= 1 && dayOfWeek <= 5) availabilityQuery.push('weekdays');
        // Check for weekends (Saturday-Sunday)
        else availabilityQuery.push('weekends');

        // Check for nights (e.g., 6 PM to 6 AM)
        if (hour >= 18 || hour < 6) availabilityQuery.push('nights');

        const availableVolunteers = await Volunteer.find({
            availability: { $in: availabilityQuery }
        });
        res.status(200).json(availableVolunteers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching available volunteers', error: error.message });
    }
};

module.exports = { getAvailableVolunteers };