const request = require('supertest');
const express = require('express');
const authRoutes = require('../../backend/src/routes/authRoutes');
const authController = require('../../backend/src/controller/authController');

jest.mock('../../backend/src/controller/authController');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register/adopter', () => {
    it('should call registerAdopter controller', async () => {
      const adopterData = {
        adopter_first_name: 'John',
        adopter_last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      authController.registerAdopter.mockImplementation((req, res) => {
        res.status(201).json({ success: true, message: 'Adopter registered successfully' });
      });

      const response = await request(app)
        .post('/api/auth/register/adopter')
        .send(adopterData);

      expect(authController.registerAdopter).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/auth/register/staff', () => {
    it('should call registerStaff controller', async () => {
      const staffData = {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        password: 'password123'
      };

      authController.registerStaff.mockImplementation((req, res) => {
        res.status(201).json({ success: true, message: 'Staff registered successfully' });
      });

      const response = await request(app)
        .post('/api/auth/register/staff')
        .send(staffData);

      expect(authController.registerStaff).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/auth/register/volunteer', () => {
    it('should call registerVolunteer controller', async () => {
      const volunteerData = {
        first_name: 'Bob',
        last_name: 'Wilson',
        email: 'bob@example.com',
        password: 'password123'
      };

      authController.registerVolunteer.mockImplementation((req, res) => {
        res.status(201).json({ success: true, message: 'Volunteer registered successfully' });
      });

      const response = await request(app)
        .post('/api/auth/register/volunteer')
        .send(volunteerData);

      expect(authController.registerVolunteer).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should call login controller', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123',
        role: 'adopter'
      };

      authController.login.mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          message: 'Login successful',
          token: 'jwt_token',
          user: { id: 1, email: 'john@example.com' }
        });
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(authController.login).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBe('jwt_token');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should call getCurrentUser controller', async () => {
      authController.getCurrentUser.mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          message: 'User data retrieved',
          user: { id: 1, email: 'john@example.com' }
        });
      });

      const response = await request(app)
        .get('/api/auth/me');

      expect(authController.getCurrentUser).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
