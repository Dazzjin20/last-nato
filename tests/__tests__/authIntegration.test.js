const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../backend/server');
const dbConfig = require('../../backend/src/config/database');

describe('Auth Integration Tests - Database Insertion', () => {
  let testDb;
  let server;

  beforeAll(async () => {
    // Connect to test database
    const testMongoURI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/stray_pets_adoption_test';
    testDb = await mongoose.connect(testMongoURI);

    // Start the server for integration testing
    server = app.listen(3001);
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
    if (testDb) {
      await mongoose.disconnect();
    }
  });

  beforeEach(async () => {
    // Clean up test data before each test
    try {
      await mongoose.connection.db.dropDatabase();
    } catch (error) {
      console.log('Cleanup error:', error.message);
    }
  });

  describe('Adopter Registration - Database Insertion', () => {
    it('should insert adopter data into database', async () => {
      const adopterData = {
        adopter_first_name: 'John',
        adopter_last_name: 'Doe',
        email: 'john.doe.test@example.com',
        adopter_phone_number: '09123456789',
        password: 'password123',
        living_situation: 'own_house',
        pet_experience: ['dogs'],
        adopter_consents: ['terms_agreed']
      };

      const response = await request(server)
        .post('/api/auth/register/adopter')
        .send(adopterData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Adopter registered successfully');

      // Verify data was inserted into database
      const adopter = await mongoose.connection.db.collection('adopters').findOne({ adopter_email: adopterData.email });

      expect(adopter).toBeTruthy();
      expect(adopter.adopter_first_name).toBe('John');
      expect(adopter.adopter_last_name).toBe('Doe');
      expect(adopter.adopter_email).toBe('john.doe.test@example.com');
      expect(adopter.adopter_phone_number).toBe('09123456789');
      expect(adopter.living_situation).toBe('own_house');
      expect(adopter.pet_experience).toContain('dogs');
      expect(adopter.consents.length).toBe(1);
      expect(adopter.consents[0].consent_type).toBe('terms_agreed');
      expect(adopter.consents[0].consented).toBe(true);
    });

    it('should prevent duplicate email registration', async () => {
      const adopterData = {
        adopter_first_name: 'Jane',
        adopter_last_name: 'Smith',
        email: 'jane.smith.test@example.com',
        adopter_phone_number: '09123456789',
        password: 'password123',
        living_situation: 'own_house',
        pet_experience: ['dogs'],
        adopter_consents: ['terms_agreed']
      };

      // First registration
      await request(server)
        .post('/api/auth/register/adopter')
        .send(adopterData);

      // Second registration with same email
      const response = await request(server)
        .post('/api/auth/register/adopter')
        .send(adopterData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email already registered');
    });
  });

  describe('Staff Registration - Database Insertion', () => {
    it('should insert staff data into database', async () => {
      const staffData = {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.staff.test@example.com',
        phone: '09123456789',
        password: 'password123',
        consents: ['terms_agreed']
      };

      const response = await request(server)
        .post('/api/auth/register/staff')
        .send(staffData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);

      // Verify data was inserted
      const staffMember = await mongoose.connection.db.collection('staff').findOne({ staff_email: staffData.email });

      expect(staffMember).toBeTruthy();
      expect(staffMember.staff_first_name).toBe('Jane');
      expect(staffMember.staff_last_name).toBe('Smith');
      expect(staffMember.consents.length).toBe(1);
      expect(staffMember.consents[0].consent_type).toBe('terms_agreed');
      expect(staffMember.consents[0].consented).toBe(true);
    });
  });

  describe('Volunteer Registration - Database Insertion', () => {
    it('should insert volunteer data into database', async () => {
      const volunteerData = {
        first_name: 'Bob',
        last_name: 'Wilson',
        email: 'bob.volunteer.test@example.com',
        phone: '09123456789',
        password: 'password123',
        availability: ['Weekdays'],
        interested_activities: ['Dog Care'],
        consents: ['terms_agreed']
      };

      const response = await request(server)
        .post('/api/auth/register/volunteer')
        .send(volunteerData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);

      // Verify volunteer was inserted
      const [volunteers] = await testDb.execute(
        'SELECT * FROM volunteers WHERE email = ?',
        [volunteerData.email]
      );

      expect(volunteers.length).toBe(1);
      const volunteer = volunteers[0];
      expect(volunteer.first_name).toBe('Bob');
      expect(volunteer.last_name).toBe('Wilson');

      // Verify volunteer profile
      const [profiles] = await testDb.execute(
        'SELECT * FROM volunteer_profiles WHERE volunteer_id = ?',
        [volunteer.id]
      );

      expect(profiles.length).toBe(1);
      const profile = profiles[0];
      expect(profile.availability).toBe('Weekdays');
      expect(profile.interested_activities).toBe('Dog Care');

      // Verify consents
      const [consents] = await testDb.execute(
        'SELECT * FROM volunteer_consents WHERE volunteer_id = ?',
        [volunteer.id]
      );

      expect(consents.length).toBe(1);
      expect(consents[0].agreed_terms).toBe(1);
    });
  });

  describe('Login - Database Verification', () => {
    it('should login successfully and return token', async () => {
      // First register a user
      const adopterData = {
        adopter_first_name: 'Login',
        adopter_last_name: 'Test',
        email: 'login.test@example.com',
        adopter_phone_number: '09123456789',
        password: 'password123',
        living_situation: 'own_house',
        pet_experience: ['dogs'],
        adopter_consents: ['terms_agreed']
      };

      await request(server)
        .post('/api/auth/register/adopter')
        .send(adopterData);

      // Now try to login
      const loginData = {
        email: 'login.test@example.com',
        password: 'password123',
        role: 'adopter'
      };

      const response = await request(server)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.data.user.email).toBe('login.test@example.com');
      expect(response.body.data.user.role).toBe('adopter');
    });

    it('should reject invalid credentials', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
        role: 'adopter'
      };

      const response = await request(server)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });
});
