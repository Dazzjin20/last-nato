const express = require('express');
const router = express.Router();
const applicationController = require('../controller/applicationController');

// Route to submit a new adoption application
router.post('/applications', applicationController.createApplication);

// Route to get all applications for a specific adopter
router.get('/applications/adopter/:adopterId', applicationController.getApplicationsForAdopter);

// Route to get a single application by its ID (either Mongo _id or custom application_id)
router.get('/applications/:id', applicationController.getApplicationById);

module.exports = router;