const express = require('express');
const authController = require('../controller/authController');

const router = express.Router();

// Registration routes
router.post('/register/adopter', authController.registerAdopter);
router.post('/register/volunteer', authController.registerVolunteer);
router.post('/register/staff', authController.registerStaff);

// Login routes
router.post('/login/adopter', authController.loginAdopter);
router.post('/login/volunteer', authController.loginVolunteer);
router.post('/login/staff', authController.loginStaff);

// Profile routes
router.get('/profile/:userType/:userId', authController.getProfile);

module.exports = router;