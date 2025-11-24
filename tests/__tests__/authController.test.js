const authController = require('../../backend/src/controller/authController');
const authService = require('../../backend/src/services/authService');

jest.mock('../../backend/src/services/authService');

describe('Auth Controller', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = global.testUtils.createMockRequest();
    mockRes = global.testUtils.createMockResponse();
    mockNext = global.testUtils.createMockNext();
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

      mockReq.body = adopterData;
      authService.registerAdopter.mockResolvedValue(1);

      await authController.registerAdopter(mockReq, mockRes, mockNext);

      expect(authService.registerAdopter).toHaveBeenCalledWith(adopterData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Adopter registered successfully',
        userId: 1
      });
    });

    it('should handle registration error', async () => {
      const adopterData = {
        adopter_first_name: 'John',
        adopter_last_name: 'Doe',
        email: 'john.doe@example.com',
        adopter_phone_number: '09123456789',
        password: 'password123'
      };

      mockReq.body = adopterData;
      const error = new Error('Email already registered');
      authService.registerAdopter.mockRejectedValue(error);

      await authController.registerAdopter(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
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

      mockReq.body = staffData;
      authService.registerStaff.mockResolvedValue(2);

      await authController.registerStaff(mockReq, mockRes, mockNext);

      expect(authService.registerStaff).toHaveBeenCalledWith(staffData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Staff registered successfully',
        userId: 2
      });
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

      mockReq.body = volunteerData;
      authService.registerVolunteer.mockResolvedValue(3);

      await authController.registerVolunteer(mockReq, mockRes, mockNext);

      expect(authService.registerVolunteer).toHaveBeenCalledWith(volunteerData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Volunteer registered successfully',
        userId: 3
      });
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'adopter'
      };

      const loginResult = {
        token: 'jwt_token_here',
        user: {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          role: 'adopter',
          status: 'active'
        }
      };

      mockReq.body = loginData;
      authService.loginUser.mockResolvedValue(loginResult);

      await authController.login(mockReq, mockRes, mockNext);

      expect(authService.loginUser).toHaveBeenCalledWith(
        loginData.email,
        loginData.password,
        loginData.role
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login successful',
        ...loginResult
      });
    });

    it('should handle login error', async () => {
      const loginData = {
        email: 'wrong@example.com',
        password: 'wrongpass',
        role: 'adopter'
      };

      mockReq.body = loginData;
      const error = new Error('Invalid email or password');
      authService.loginUser.mockRejectedValue(error);

      await authController.login(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
