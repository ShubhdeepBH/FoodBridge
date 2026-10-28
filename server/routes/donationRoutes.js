/**
 * FoodBridge - Donation Routes
 *
 * CA2 Syllabus Concepts Demonstrated:
 * - Express Router module
 * - RESTful route definitions (GET /, POST /, GET /:id)
 * - Middleware integration: securing state-mutating route (POST /) with JWT protect middleware
 * - Separation of routing and controller logic
 */

const express = require("express");
const router = express.Router();
const {
  getAllDonations,
  getDonationById,
  createDonation
} = require("../controllers/donationController");
const { protect } = require("../middleware/authMiddleware");

// Route: GET /api/donations - Retrieve all donations (Public)
router.get("/", getAllDonations);

// Route: POST /api/donations - Create a new donation (Protected, Donor only)
router.post("/", protect, createDonation);

// Route: GET /api/donations/:id - Retrieve a single donation by ID (Public)
router.get("/:id", getDonationById);

module.exports = router;
