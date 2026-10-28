/**
 * FoodBridge - Donation Routes
 *
 * CA2 Syllabus Concepts Demonstrated:
 * - Express Router module
 * - RESTful route definitions (GET /, POST /, GET /:id)
 * - Separation of routing and controller logic
 */

const express = require("express");
const router = express.Router();
const {
  getAllDonations,
  getDonationById,
  createDonation
} = require("../controllers/donationController");

// Route: GET /api/donations - Retrieve all donations
router.get("/", getAllDonations);

// Route: POST /api/donations - Create a new donation
router.post("/", createDonation);

// Route: GET /api/donations/:id - Retrieve a single donation by ID
router.get("/:id", getDonationById);

module.exports = router;
