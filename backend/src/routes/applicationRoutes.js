const express = require('express');
const applicationController = require('../controller/applicationController');

const router = express.Router();

// Route for submitting a new application
router.post('/submit', applicationController.submitApplication);

// Route to get all applications for a specific adopter
router.get('/adopter/:adopterId', applicationController.getAdopterApplications);

// Route to get a single application by its ID
router.get('/:applicationId', applicationController.getApplicationById);

// Route to get all applications (for staff)
router.get('/', applicationController.getAllApplications);

// Route to update an application's status
router.put('/:applicationId/status', applicationController.updateApplicationStatus);

module.exports = router;