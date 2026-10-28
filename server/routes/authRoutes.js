/**
 * FoodBridge - Authentication Routes
 *
 * CA2 Syllabus Concepts Demonstrated:
 * - Express Router module
 * - RESTful route definitions for authentication endpoints (register, login)
 * - Separation of routing and controller logic
 */

const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// Route: POST /api/auth/register - Register a new user
router.post("/register", registerUser);

// Route: POST /api/auth/login - Authenticate user and login
router.post("/login", loginUser);

module.exports = router;
