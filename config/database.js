// config/database.js
// Database configuration file - connects to MongoDB Atlas
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Connect to MongoDB using connection string from .env file
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        process.exit(1); // Exit process if database connection fails
    }
};

module.exports = connectDB;