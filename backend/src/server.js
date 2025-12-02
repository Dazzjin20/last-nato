const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/database'); // Import the database connection handler
const adopterRepository = require('./repositories/adopterRepository');
const volunteerRepository = require('./repositories/volunteerRepository');
const staffRepository = require('./repositories/staffRepository');
const petRoutes = require('./routes/petRoutes');

const app = express();
app.use(cors());
// Accept larger JSON payloads for base64 image uploads
app.use(express.json({ limit: '12mb' }));
// Also support URL-encoded form bodies at larger size
app.use(express.urlencoded({ limit: '12mb', extended: true }));

// Generic registration handler to reduce code duplication
async function handleRegistration(req, res, repository) {
  try {
    const { email } = req.body;
    const existingUser = await repository.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }
    // Note: In a real app, you should hash the password here before saving.
    // const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // const user = await repository.create({ ...req.body, password: hashedPassword });
    const user = await repository.create(req.body);
    // Avoid sending password back to client
    user.password = undefined;
    return res.status(201).json({ message: 'Registration successful!', user });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'An error occurred during registration.', error: err.message });
  }
}

// --- API ROUTES ---

// Adopter Registration
app.post('/api/auth/register/adopter', (req, res) => {
  handleRegistration(req, res, adopterRepository);
});

// Volunteer Registration
app.post('/api/auth/register/volunteer', (req, res) => {
  handleRegistration(req, res, volunteerRepository);
});

// Staff Registration
app.post('/api/auth/register/staff', (req, res) => {
  handleRegistration(req, res, staffRepository);
});

// Generic login handler
async function handleLogin(req, res, repository, role) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await repository.findByEmail(email);

    // In a real app, compare hashed passwords: const isMatch = await bcrypt.compare(password, user.password);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: `Invalid credentials or you do not have a ${role} account.` });
    }

    user.password = undefined; // Do not send password to the client
    return res.status(200).json({ message: 'Login successful!', user });
  } catch (err) {
    console.error(`${role} Login error:`, err);
    return res.status(500).json({ message: 'An error occurred during login.', error: err.message });
  }
}

// Adopter Login
app.post('/api/auth/login/adopter', (req, res) => {
  handleLogin(req, res, adopterRepository, 'adopter');
});

// Volunteer Login
app.post('/api/auth/login/volunteer', (req, res) => {
  handleLogin(req, res, volunteerRepository, 'volunteer');
});

// Staff Login
app.post('/api/auth/login/staff', (req, res) => {
  handleLogin(req, res, staffRepository, 'staff');
});

// Mount pet routes
app.use('/api/pets', petRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await db.connect(); // Use your database class to connect
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();