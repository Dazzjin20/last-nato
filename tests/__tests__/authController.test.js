const { handleForgotPassword, handleResetPassword } = require('../src/services/authController');
const adopterRepository = require('../src/repositories/adopterRepository');
const volunteerRepository = require('../src/repositories/volunteerRepository');
const staffRepository = require('../src/repositories/staffRepository');
const emailService = require('../src/services/emailService');
const crypto = require('crypto');

// Mocking the dependencies
jest.mock('../src/repositories/adopterRepository');
jest.mock('../src/repositories/volunteerRepository');
jest.mock('../src/repositories/staffRepository');
jest.mock('../src/services/emailService');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock Express request and response objects
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('handleForgotPassword', () => {
    it('should return a generic success message if email does not exist', async () => {
      req.body.email = 'nonexistent@example.com';
      adopterRepository.findByEmail.mockResolvedValue(null);
      volunteerRepository.findByEmail.mockResolvedValue(null);
      staffRepository.findByEmail.mockResolvedValue(null);

      await handleForgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    });

    it('should generate a reset token and send an email if user exists', async () => {
      const mockUser = {
        email: 'test@example.com',
        password_reset_token: '',
        password_reset_expires: null,
        save: jest.fn().mockResolvedValue(true),
      };
      req.body.email = 'test@example.com';

      adopterRepository.findByEmail.mockResolvedValue(mockUser);
      volunteerRepository.findByEmail.mockResolvedValue(null);
      staffRepository.findByEmail.mockResolvedValue(null);

      await handleForgotPassword(req, res);

      expect(mockUser.save).toHaveBeenCalled();
      expect(mockUser.password_reset_token).not.toBe('');
      expect(mockUser.password_reset_expires).not.toBeNull();
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith(mockUser.email, expect.any(String));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    });
  });

  describe('handleResetPassword', () => {
    // Note: The current implementation of handleResetPassword is not easily testable
    // because it fetches all users. A better approach would be to have a
    // `findByToken` method in each repository. This test is based on the current code.
    
    it('should return an error for an invalid or expired token', async () => {
        req.body = { token: 'invalidtoken', password: 'newPassword123' };

        // Mocking the inefficient findAll calls
        adopterRepository.findAll = jest.fn().mockResolvedValue([]);
        volunteerRepository.findAll = jest.fn().mockResolvedValue([]);
        staffRepository.findAll = jest.fn().mockResolvedValue([]);

        await handleResetPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Password reset token is invalid or has expired.' });
    });

    it('should reset the password for a valid token', async () => {
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        const mockUser = {
            password_reset_token: hashedToken,
            password_reset_expires: Date.now() + 10 * 60 * 1000, // Expires in 10 minutes
            save: jest.fn().mockResolvedValue(true),
        };

        req.body = { token: resetToken, password: 'newPassword123' };

        // Mocking the inefficient findAll calls
        adopterRepository.findAll = jest.fn().mockResolvedValue([mockUser]);
        volunteerRepository.findAll = jest.fn().mockResolvedValue([]);
        staffRepository.findAll = jest.fn().mockResolvedValue([]);

        await handleResetPassword(req, res);

        expect(mockUser.save).toHaveBeenCalled();
        expect(mockUser.password).toBe('newPassword123'); // Hashing is mocked at repo/model level
        expect(mockUser.password_reset_token).toBeUndefined();
        expect(mockUser.password_reset_expires).toBeUndefined();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Password has been reset successfully.' });
    });
  });
});