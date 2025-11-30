const authService = require('../services/authService');

class AuthController {
    async registerAdopter(req, res) {
        try {
            const {
                first_name,
                last_name,
                email,
                phone,
                password,
                living_situation,
                pet_experience,
                consents
            } = req.body;

            // Validate required fields
            if (!first_name || !last_name || !email || !phone || !password || !living_situation) {
                return res.status(400).json({
                    error: 'Missing required fields',
                    required: ['first_name', 'last_name', 'email', 'phone', 'password', 'living_situation']
                });
            }

            const result = await authService.registerAdopter({
                first_name,
                last_name,
                email,
                phone,
                password,
                living_situation,
                pet_experience: pet_experience || [],
                consents: consents || []
            });

            res.status(201).json({
                message: 'Adopter registered successfully',
                user: result
            });
        } catch (error) {
            console.error('Adopter registration error:', error);
            res.status(400).json({
                error: error.message
            });
        }
    }

    async registerVolunteer(req, res) {
        try {
            const {
                first_name,
                last_name,
                email,
                phone,
                password,
                availability,
                interested_activities,
                consents
            } = req.body;

            // Validate required fields
            if (!first_name || !last_name || !email || !phone || !password) {
                return res.status(400).json({
                    error: 'Missing required fields',
                    required: ['first_name', 'last_name', 'email', 'phone', 'password']
                });
            }

            // Validate consents
            const requiredConsents = ['agreed_terms', 'consent_background_check'];
            const missingConsents = requiredConsents.filter(consent => 
                !consents?.includes(consent)
            );

            if (missingConsents.length > 0) {
                return res.status(400).json({
                    error: 'Missing required consents',
                    missing: missingConsents
                });
            }

            const result = await authService.registerVolunteer({
                first_name,
                last_name,
                email,
                phone,
                password,
                availability: availability || [],
                interested_activities: interested_activities || [],
                consents: consents || []
            });

            res.status(201).json({
                message: 'Volunteer registered successfully',
                user: result
            });
        } catch (error) {
            console.error('Volunteer registration error:', error);
            res.status(400).json({
                error: error.message
            });
        }
    }

    async registerStaff(req, res) {
        try {
            const {
                first_name,
                last_name,
                email,
                phone,
                password,
                consents
            } = req.body;

            // Validate required fields
            if (!first_name || !last_name || !email || !phone || !password) {
                return res.status(400).json({
                    error: 'Missing required fields',
                    required: ['first_name', 'last_name', 'email', 'phone', 'password']
                });
            }

            // Validate consents
            const requiredConsents = ['agreed_terms', 'consents_background_check'];
            const missingConsents = requiredConsents.filter(consent => 
                !consents?.includes(consent)
            );

            if (missingConsents.length > 0) {
                return res.status(400).json({
                    error: 'Missing required consents',
                    missing: missingConsents
                });
            }

            const result = await authService.registerStaff({
                first_name,
                last_name,
                email,
                phone,
                password,
                consents: consents || [],
                role: 'coordinator', // Default role for new staff
                department: 'administration' // Default department
            });

            res.status(201).json({
                message: 'Staff registered successfully',
                user: result
            });
        } catch (error) {
            console.error('Staff registration error:', error);
            res.status(400).json({
                error: error.message
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password, userType } = req.body;

            if (!email || !password || !userType) {
                return res.status(400).json({
                    error: 'Missing required fields',
                    required: ['email', 'password', 'userType']
                });
            }

            const user = await authService.validateUserCredentials(email, password, userType);
            
            if (!user) {
                return res.status(401).json({
                    error: 'Invalid email or password'
                });
            }

            // Return user data (without password)
            const { password: _, ...userData } = user.toObject();
            
            res.json({
                message: 'Login successful',
                user: userData
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(400).json({
                error: error.message
            });
        }
    }

    async getProfile(req, res) {
        try {
            const { userId, userType } = req.params;

            const profile = await authService.getUserProfile(userId, userType);
            
            res.json({
                user: profile
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(400).json({
                error: error.message
            });
        }
    }
}

module.exports = new AuthController();