const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    // Example: ['weekdays', 'weekends', 'nights']
    availability: [{ type: String, enum: ['weekdays', 'weekends', 'nights', 'anytime'] }]
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer;