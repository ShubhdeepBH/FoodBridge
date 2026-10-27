/**
 * FoodBridge - Donation Controller
 *
 * CA2 Syllabus Concepts Demonstrated:
 * - Express controller request handlers (req, res)
 * - Asynchronous operations with async/await and try/catch
 * - Mongoose database queries (Donation.find, Donation.findById)
 * - Input validation using mongoose.isValidObjectId()
 * - Standard REST HTTP status codes (200 OK, 400 Bad Request, 404 Not Found, 500 Internal Server Error)
 * - Safe error handling avoiding stack trace or credential leakage
 */

const mongoose = require("mongoose");
const Donation = require("../models/Donation");

/**
 * @desc    Get all donations
 * @route   GET /api/donations
 * @access  Public
 */
const getAllDonations = async (req, res) => {
  try {
    // Retrieve all donations from MongoDB, sorted by newest first
    const donations = await Donation.find().sort({ createdAt: -1 });

    // Returns array of donations (empty array [] if none exist)
    return res.status(200).json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error.message);
    return res.status(500).json({
      message: "Failed to retrieve donations. Please try again later."
    });
  }
};

/**
 * @desc    Get a single donation by ID
 * @route   GET /api/donations/:id
 * @access  Public
 */
const getDonationById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate that the param is a syntactically valid 24-char hex MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid donation ID format"
      });
    }

    // Query database for matching document
    const donation = await Donation.findById(id);

    // If no document exists with this ID, return 404
    if (!donation) {
      return res.status(404).json({
        message: "Donation not found"
      });
    }

    // Return the found donation with HTTP 200
    return res.status(200).json(donation);
  } catch (error) {
    console.error(`Error fetching donation ${req.params.id}:`, error.message);
    return res.status(500).json({
      message: "Failed to retrieve donation. Please try again later."
    });
  }
};

module.exports = {
  getAllDonations,
  getDonationById
};
