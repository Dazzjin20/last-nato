const bcrypt = require('bcryptjs');
const adopterRepository = require('../repositories/adopterRepository');
const volunteerRepository = require('../repositories/volunteerRepository');
const staffRepository = require('../repositories/staffRepository');

class AuthService {
    constructor() {
        this.saltRounds = 12;
    }

    async hashPassword(password) {
        return await bcrypt.hash(password, this.saltRounds);
    }

    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    async registerAdopter(adopterData) {
        try {
            // Check if email already exists
            const existingAdopter = await adopterRepository.findByEmail(adopterData.email);
            if (existingAdopter) {
                throw new Error('Email already registered');
            }

            // Hash password
            const hashedPassword = await this.hashPassword(adopterData.password);
            
            // Create adopter
            const adopter = await adopterRepository.create({
                ...adopterData,
                password: hashedPassword
            });

            return {
                id: adopter._id,
                email: adopter.email,
                first_name: adopter.first_name,
                last_name: adopter.last_name,
                user_type: 'adopter'
            };
        } catch (error) {
            throw new Error(`Adopter registration failed: ${error.message}`);
        }
    }

    async registerVolunteer(volunteerData) {
        try {
            const existingVolunteer = await volunteerRepository.findByEmail(volunteerData.email);
            if (existingVolunteer) {
                throw new Error('Email already registered');
            }

            const hashedPassword = await this.hashPassword(volunteerData.password);
            
            const volunteer = await volunteerRepository.create({
                ...volunteerData,
                password: hashedPassword
            });

            return {
                id: volunteer._id,
                email: volunteer.email,
                first_name: volunteer.first_name,
                last_name: volunteer.last_name,
                user_type: 'volunteer'
            };
        } catch (error) {
            throw new Error(`Volunteer registration failed: ${error.message}`);
        }
    }

    async registerStaff(staffData) {
        try {
            const existingStaff = await staffRepository.findByEmail(staffData.email);
            if (existingStaff) {
                throw new Error('Email already registered');
            }

            const hashedPassword = await this.hashPassword(staffData.password);
            
            const staff = await staffRepository.create({
                ...staffData,
                password: hashedPassword
            });

            return {
                id: staff._id,
                email: staff.email,
                first_name: staff.first_name,
                last_name: staff.last_name,
                user_type: 'staff'
            };
        } catch (error) {
            throw new Error(`Staff registration failed: ${error.message}`);
        }
    }

    async validateUserCredentials(email, password, userType) {
        try {
            let user;
            
            switch (userType) {
                case 'adopter':
                    user = await adopterRepository.findByEmail(email);
                    break;
                case 'volunteer':
                    user = await volunteerRepository.findByEmail(email);
                    break;
                case 'staff':
                    user = await staffRepository.findByEmail(email);
                    break;
                default:
                    throw new Error('Invalid user type');
            }

            if (!user) {
                return null;
            }

            const isPasswordValid = await this.comparePassword(password, user.password);
            if (!isPasswordValid) {
                return null;
            }

            return user;
        } catch (error) {
            throw new Error(`Authentication failed: ${error.message}`);
        }
    }

    async getUserProfile(userId, userType) {
        try {
            let user;
            
            switch (userType) {
                case 'adopter':
                    user = await adopterRepository.findById(userId);
                    break;
                case 'volunteer':
                    user = await volunteerRepository.findById(userId);
                    break;
                case 'staff':
                    user = await staffRepository.findById(userId);
                    break;
                default:
                    throw new Error('Invalid user type');
            }

            if (!user) {
                throw new Error('User not found');
            }

            // Return user profile without sensitive data
            const { password, ...userProfile } = user.toObject();
            return userProfile;
        } catch (error) {
            throw new Error(`Failed to get user profile: ${error.message}`);
        }
    }
}

module.exports = new AuthService();