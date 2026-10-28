/**
 * FoodBridge - Donation Controller
 *
 * CA2 Syllabus Concepts Demonstrated:
 * - Express controller request handlers (req, res)
 * - Asynchronous operations with async/await and try/catch
 * - Mongoose database queries (Donation.find, Donation.findById, donation.save, User.findById)
 * - Role-Based Access Control (RBAC): enforcing donor-only write permissions (403 Forbidden)
 * - Identity derivation from authenticated token (req.user.id) and database verification (401 Unauthorized)
 * - Tamper resistance: ignoring client-supplied status, donor ID, and donor name
 * - Input validation using mongoose.isValidObjectId() and Mongoose schema validation
 * - Standard REST HTTP status codes (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error)
 * - Safe error handling avoiding stack trace or credential leakage
 */

const mongoose = require("mongoose");
const Donation = require("../models/Donation");
const User = require("../models/User");

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

/**
 * @desc    Create a new donation
 * @route   POST /api/donations
 * @access  Private (Authenticated donors only)
 */
const createDonation = async (req, res) => {
  try {
    // 1. Role Authorization: Only authenticated users with role 'donor' can create listings
    if (req.user.role !== "donor") {
      return res.status(403).json({
        message: "Access forbidden. Only donors can create donations"
      });
    }

    // 2. Guard against missing, null, array, or non-object request body
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Invalid request body. A JSON object is required"
      });
    }

    // 3. User Existence Verification: Ensure authenticated user still exists in database
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({
        message: "User account not found. Authorization denied"
      });
    }

    // 4. Extract only allowed client fields (client-supplied donor, donorName, and status are discarded)
    const {
      title,
      category,
      quantity,
      expiry,
      description,
      pickupLocation,
      pickupInstructions,
      imageUrl
    } = req.body;

    // 5. Instantiate new donation document using authenticated identity and default status
    const donation = new Donation({
      title,
      category,
      quantity,
      expiry,
      description,
      pickupLocation,
      pickupInstructions,
      imageUrl: typeof imageUrl === "string" ? imageUrl.trim() : "",
      donor: req.user.id,
      donorName: user.name,
      status: "available"
    });

    // 6. Save to database (triggers Mongoose schema validation)
    const savedDonation = await donation.save();

    // 7. Return HTTP 201 Created with saved record
    return res.status(201).json(savedDonation);
  } catch (error) {
    // Mongoose schema validation error (missing required fields, enum mismatch, maxlength exceeded)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        message: "Validation failed",
        errors: messages
      });
    }

    // Mongoose cast error (e.g. malformed Date)
    if (error.name === "CastError") {
      return res.status(400).json({
        message: `Invalid value for field '${error.path}'`
      });
    }

    console.error("Error creating donation:", error.message);
    return res.status(500).json({
      message: "Failed to create donation. Please try again later."
    });
  }
};

module.exports = {
  getAllDonations,
  getDonationById,
  createDonation
};
