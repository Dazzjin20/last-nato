const authService = require('../../backend/src/services/authService');
const adopterRepo = require('../../backend/src/repositories/adopterRepository');
const staffRepo = require('../../backend/src/repositories/staffRepository');
const volunteerRepo = require('../../backend/src/repositories/volunteerRepository');

jest.mock('../../backend/src/repositories/adopterRepository');
jest.mock('../../backend/src/repositories/staffRepository');
jest.mock('../../backend/src/repositories/volunteerRepository');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerAdopter', () => {
    it('should register adopter successfully', async () => {
      const adopterData = {
        adopter_first_name: 'John',
        adopter_last_name: 'Doe',
        email: 'john.doe@example.com',
        adopter_phone_number: '09123456789',
        password: 'password123',
        living_situation: 'own_house',
        pet_experience: ['dogs'],
        adopter_consents: ['terms_agreed']
      };

      adopterRepo.findAdopterByEmail.mockResolvedValue(null);
      adopterRepo.createAdopter.mockResolvedValue(1);
      adopterRepo.createAdopterProfile = jest.fn().mockResolvedValue();
      adopterRepo.createAdopterConsents = jest.fn().mockResolvedValue();

      const result = await authService.registerAdopter(adopterData);

      expect(adopterRepo.findAdopterByEmail).toHaveBeenCalledWith(adopterData.email);
      expect(adopterRepo.createAdopter).toHaveBeenCalledWith({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '09123456789',
        password: expect.any(String) // Hashed password
      });
      expect(result).toBe(1);
    });

    it('should throw error if email already exists', async () => {
      const adopterData = {
        email: 'existing@example.com'
      };

      adopterRepo.findAdopterByEmail.mockResolvedValue({ id: 1, email: 'existing@example.com' });

      await expect(authService.registerAdopter(adopterData)).rejects.toThrow('Email already registered');
    });

    it('should throw error if required fields are missing', async () => {
      const adopterData = {
        email: 'john@example.com'
        // Missing required fields
      };

      await expect(authService.registerAdopter(adopterData)).rejects.toThrow('All required fields must be provided');
    });
  });

  describe('registerStaff', () => {
    it('should register staff successfully', async () => {
      const staffData = {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        phone: '09123456789',
        password: 'password123',
        consents: ['terms_agreed']
      };

      staffRepo.findStaffByEmail.mockResolvedValue(null);
      staffRepo.createStaff.mockResolvedValue(2);
      staffRepo.createStaffConsents = jest.fn().mockResolvedValue();

      const result = await authService.registerStaff(staffData);

      expect(staffRepo.findStaffByEmail).toHaveBeenCalledWith(staffData.email);
      expect(staffRepo.createStaff).toHaveBeenCalledWith({
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        phone: '09123456789',
        password: expect.any(String),
        emergency_number: null,
        role: 'Staff'
      });
      expect(result).toBe(2);
    });
  });

  describe('registerVolunteer', () => {
    it('should register volunteer successfully', async () => {
      const volunteerData = {
        first_name: 'Bob',
        last_name: 'Wilson',
        email: 'bob.wilson@example.com',
        phone: '09123456789',
        password: 'password123',
        availability: ['Weekdays'],
        interested_activities: ['Dog Care'],
        consents: ['terms_agreed']
      };

      volunteerRepo.findVolunteerByEmail.mockResolvedValue(null);
      volunteerRepo.createVolunteer.mockResolvedValue(3);
      volunteerRepo.createVolunteerProfile = jest.fn().mockResolvedValue();
      volunteerRepo.createVolunteerConsents = jest.fn().mockResolvedValue();

      const result = await authService.registerVolunteer(volunteerData);

      expect(volunteerRepo.findVolunteerByEmail).toHaveBeenCalledWith(volunteerData.email);
      expect(volunteerRepo.createVolunteer).toHaveBeenCalledWith({
        first_name: 'Bob',
        last_name: 'Wilson',
        email: 'bob.wilson@example.com',
        phone: '09123456789',
        password: expect.any(String)
      });
      expect(result).toBe(3);
    });
  });

  describe('loginUser', () => {
    it('should login adopter successfully', async () => {
      const email = 'john@example.com';
      const password = 'password123';
      const role = 'adopter';

      const mockUser = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: '$2a$12$hashedpassword' // Mock hashed password
      };

      adopterRepo.findAdopterByEmail.mockResolvedValue(mockUser);
      authService.comparePassword = jest.fn().mockResolvedValue(true);
      authService.generateToken = jest.fn().mockReturnValue('jwt_token');

      const result = await authService.loginUser(email, password, role);

      expect(adopterRepo.findAdopterByEmail).toHaveBeenCalledWith(email);
      expect(authService.comparePassword).toHaveBeenCalledWith(password, mockUser.password);
      expect(authService.generateToken).toHaveBeenCalledWith(mockUser.id, role);
      expect(result).toEqual({
        token: 'jwt_token',
        user: {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          role: 'adopter',
          status: undefined
        }
      });
    });

    it('should throw error for invalid credentials', async () => {
      const email = 'wrong@example.com';
      const password = 'wrongpass';
      const role = 'adopter';

      adopterRepo.findAdopterByEmail.mockResolvedValue(null);

      await expect(authService.loginUser(email, password, role)).rejects.toThrow('Invalid email or password');
    });

    it('should throw error for inactive staff', async () => {
      const email = 'staff@example.com';
      const password = 'password123';
      const role = 'staff';

      const mockUser = {
        id: 2,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'staff@example.com',
        password: '$2a$12$hashedpassword',
        status: 'inactive'
      };

      staffRepo.findStaffByEmail.mockResolvedValue(mockUser);

      await expect(authService.loginUser(email, password, role)).rejects.toThrow('Your staff account is not active. Please contact administrator.');
    });
  });

  describe('hashPassword and comparePassword', () => {
    it('should hash password', async () => {
      const password = 'testpassword';
      const hashed = await authService.hashPassword(password);

      expect(hashed).toBeDefined();
      expect(typeof hashed).toBe('string');
      expect(hashed).not.toBe(password);
    });

    it('should compare password correctly', async () => {
      const password = 'testpassword';
      const hashed = await authService.hashPassword(password);

      const isValid = await authService.comparePassword(password, hashed);
      const isInvalid = await authService.comparePassword('wrongpassword', hashed);

      expect(isValid).toBe(true);
      expect(isInvalid).toBe(false);
    });
  });

  describe('generateToken and verifyToken', () => {
    it('should generate and verify token', () => {
      const userId = 1;
      const role = 'adopter';

      const token = authService.generateToken(userId, role);
      const decoded = authService.verifyToken(token);

      expect(decoded.userId).toBe(userId);
      expect(decoded.role).toBe(role);
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        authService.verifyToken('invalid_token');
      }).toThrow('Invalid token');
    });
  });
});
