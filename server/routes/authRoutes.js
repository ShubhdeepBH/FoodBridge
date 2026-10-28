/**
 * FoodBridge - Authentication Routes
 *
 * CA2 Syllabus Concepts Demonstrated:
 * - Express Router module
 * - RESTful route definition for authentication endpoints
 * - Separation of routing and controller logic
 */

const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController");

// Route: POST /api/auth/register - Register a new user
router.post("/register", registerUser);

module.exports = router;
