/**
 * FoodBridge - Backend Server Entry Point
 * 
 * CA2 Syllabus Concepts Demonstrated:
 * - Node.js modules & CommonJS require syntax
 * - Express server initialization & lifecycle
 * - Middleware usage: cors and express.json
 * - Environment variable configuration via dotenv
 * - REST API endpoint creation and JSON responses
 */

// 1. Load environment variables from server/.env file into process.env
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

// 2. Import core dependencies
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const donationRoutes = require("./routes/donationRoutes");

// 3. Initialize the Express application
const app = express();

// 4. Global Middleware Configuration
// CORS (Cross-Origin Resource Sharing): Allows frontend applications on different ports to communicate with this API
app.use(cors());

// Body Parsers: Built-in Express middleware to parse incoming request payloads
app.use(express.json()); // Parses incoming requests with application/json bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded form data

// 5. Basic API Routes
// Root route: General API metadata
app.get("/", (req, res) => {
  res.json({
    name: "FoodBridge API",
    version: "1.0.0",
    description: "Backend REST API for FoodBridge Surplus Rescue Platform",
    endpoints: {
      health: "/api/health",
      donations: "/api/donations"
    }
  });
});

// Health check endpoint: Used to verify server uptime and connectivity
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "FoodBridge API is running",
    database: "connected",
    timestamp: new Date().toISOString()
  });
});

// Mount resource routes
app.use("/api/donations", donationRoutes);

// 6. Connect Database & Start HTTP Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Establish connection to MongoDB Atlas before accepting HTTP requests
    await connectDB();

    // Start listening only after DB connection succeeds
    app.listen(PORT, () => {
      console.log(`FoodBridge server running on port ${PORT}`);
      console.log(`Health check available at: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("Failed to start server due to unexpected error:", error.message);
    process.exit(1);
  }
};

startServer();
