const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Registration routes
router.post('/register/adopter', authController.registerAdopter);
router.post('/register/volunteer', authController.registerVolunteer);
router.post('/register/staff', authController.registerStaff);

// Authentication routes
router.post('/login', authController.login);

// Profile routes
router.get('/profile/:userType/:userId', authController.getProfile);

module.exports = router;