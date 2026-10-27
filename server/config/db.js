/**
 * FoodBridge - MongoDB Database Connection
 * 
 * CA2 Syllabus Concepts Demonstrated:
 * - Asynchronous programming using async/await and try/catch
 * - Database connectivity with Mongoose ODM (Object Data Modeling)
 * - Environment variable management for database connection strings
 * - Safe error handling and graceful shutdown without credential exposure
 */

const mongoose = require("mongoose");

/**
 * Establishes connection to MongoDB Atlas using Mongoose.
 * Exits the process if connection cannot be established.
 * 
 * @returns {Promise<typeof mongoose>} Mongoose instance
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in environment variables (.env)");
    }

    // Connect to MongoDB using Mongoose
    const conn = await mongoose.connect(mongoUri);

    // Log connection host safely without exposing username, password, or full URI
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    // Print sanitized error message without credentials
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
