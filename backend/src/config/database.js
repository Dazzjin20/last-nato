const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stray_pets_adoption';

class Database {
    constructor() {
        this.isConnected = false;
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    async connect() {
        if (this.isConnected) {
            console.log('Using existing database connection');
            return;
        }

        try {
            await mongoose.connect(mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 3000,
                socketTimeoutMS: 45000,
            });
            
            this.isConnected = true;
            this.retryCount = 0;
            console.log(' MongoDB connected successfully');
            
            this.setupEventListeners();
        } catch (error) {
            this.retryCount++;
            console.error(`MongoDB connection failed (attempt ${this.retryCount}):`, error.message);
            
            if (this.retryCount < this.maxRetries) {
                console.log(` Retrying connection in 5 seconds...`);
                setTimeout(() => this.connect(), 3000);
            } else {
                console.error(' Maximum connection retries reached. Exiting...');
                process.exit(1);
            }
        }
    }

    setupEventListeners() {
        mongoose.connection.on('error', (error) => {
            console.error(' MongoDB connection error:', error);
            this.isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            console.log(' MongoDB disconnected');
            this.isConnected = false;
        });

        mongoose.connection.on('reconnected', () => {
            console.log(' MongoDB reconnected');
            this.isConnected = true;
        });

        mongoose.connection.on('connected', () => {
            console.log(' MongoDB connected');
            this.isConnected = true;
        });
    }

    async disconnect() {
        if (!this.isConnected) {
            return;
        }

        try {
            await mongoose.connection.close();
            this.isConnected = false;
            console.log(' MongoDB disconnected successfully');
        } catch (error) {
            console.error(' Error disconnecting from MongoDB:', error);
            throw error;
        }
    }

    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            readyState: mongoose.connection.readyState,
            database: mongoose.connection.db ? mongoose.connection.db.databaseName : 'unknown'
        };
    }

    async healthCheck() {
        try {
            await mongoose.connection.db.admin().ping();
            return {
                status: 'healthy',
                database: mongoose.connection.db.databaseName
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error.message
            };
        }
    }
}

module.exports = new Database();