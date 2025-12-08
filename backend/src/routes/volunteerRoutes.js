const express = require('express');
const router = express.Router();
const { getAvailableVolunteers } = require('../controller/volunteerController');

// Handles requests to /api/volunteers/available
router.route('/available').get(getAvailableVolunteers);

module.exports = router;