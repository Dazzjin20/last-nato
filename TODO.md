# TODO: Convert SQL to MongoDB

## Steps to Complete
- [ ] Update package.json: Add mongoose dependency, remove mysql2
- [ ] Update backend/src/config/database.js: Replace MySQL connection with MongoDB using mongoose
- [ ] Update backend/src/models/index.js: Define Mongoose schemas for adopter_info, staff_info, volunteer_info, and related collections
- [ ] Update backend/src/repositories/adopterRepository.js: Convert SQL queries to MongoDB operations using Mongoose models
- [ ] Update backend/src/repositories/staffRepository.js: Convert SQL queries to MongoDB operations using Mongoose models
- [ ] Update backend/src/repositories/volunteerRepository.js: Convert SQL queries to MongoDB operations using Mongoose models
- [ ] Update tests/__tests__/authIntegration.test.js: Replace MySQL test setup with MongoDB
- [ ] Update .env or config for MongoDB URI (e.g., MONGODB_URI)
- [ ] Run npm install to install new dependencies
- [ ] Test the server by running node backend/server.js
