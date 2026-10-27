/**
 * FoodBridge - Donation Routes
 *
 * CA2 Syllabus Concepts Demonstrated:
 * - Express Router module
 * - RESTful route definition (GET /, GET /:id)
 * - Separation of routing and controller logic
 */

const express = require("express");
const router = express.Router();
const {
  getAllDonations,
  getDonationById
} = require("../controllers/donationController");

// Route: GET /api/donations - Retrieve all donations
router.get("/", getAllDonations);

// Route: GET /api/donations/:id - Retrieve a single donation by ID
router.get("/:id", getDonationById);

module.exports = router;
