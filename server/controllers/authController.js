/**
 * FoodBridge - Authentication Controller
 *
 * CA2 Syllabus Concepts Demonstrated:
 * - Express controller architecture (req, res separation)
 * - Asynchronous operations with async/await and try/catch
 * - Password hashing and verification using bcrypt (one-way cryptographic hashing & compare)
 * - Input validation & sanitization (body structure, email normalization, password checks)
 * - Role-Based Access Control (RBAC) security: restricting privileged roles from public registration
 * - MongoDB duplicate key handling (error code 11000) for unique database index enforcement
 * - Generic authentication error handling (401 Unauthorized) to prevent account enumeration
 * - Standard RESTful HTTP status codes (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 409 Conflict, 500 Internal Server Error)
 * - Information security: strictly omitting sensitive fields (passwords, hashes) from responses and logs
 */

const bcrypt = require("bcrypt");
const User = require("../models/User");

// Number of salt rounds for bcrypt hashing (standard recommended computational cost)
const SALT_ROUNDS = 10;

/**
 * @desc    Register a new user (donor or ngo)
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    // Guard against missing, null, array, or non-object request body
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Invalid request body. A JSON object is required"
      });
    }

    const { name, email, password, role, phone, address } = req.body;

    // 1. Validate required fields presence
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Name is required"
      });
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        message: "Email address is required"
      });
    }

    if (!password || typeof password !== "string") {
      return res.status(400).json({
        message: "Password is required"
      });
    }

    // 2. Validate raw password length prior to hashing (Mongoose schema minlength is 6, bcrypt limit is 72 bytes)
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    if (Buffer.byteLength(password, "utf8") > 72) {
      return res.status(400).json({
        message: "Password cannot exceed 72 bytes"
      });
    }

    // 3. Role Security: Validate and restrict role assignment for public registration
    // Default to 'donor' if role is not explicitly provided
    let assignedRole = "donor";

    if (role !== undefined && role !== null) {
      if (typeof role !== "string") {
        return res.status(400).json({
          message: "Role must be a string"
        });
      }

      const normalizedRole = role.toLowerCase().trim();

      // Explicitly reject any attempt to register with administrative privileges
      if (normalizedRole === "admin") {
        return res.status(400).json({
          message: "Registration with the 'admin' role is not permitted"
        });
      }

      // Restrict public registration strictly to allowed roles: 'donor' or 'ngo'
      if (normalizedRole !== "donor" && normalizedRole !== "ngo") {
        return res.status(400).json({
          message: "Invalid role. Public registration only permits 'donor' or 'ngo'"
        });
      }

      assignedRole = normalizedRole;
    }

    // 4. Hash password with bcrypt before persisting to database
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Instantiate new User document with sanitized data
    const user = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: assignedRole,
      phone: typeof phone === "string" ? phone.trim() : "",
      address: typeof address === "string" ? address.trim() : ""
    });

    // 6. Save document (triggers Mongoose schema validations: regex match, string constraints)
    const savedUser = await user.save();

    // 7. Return HTTP 201 Created with safe user information only (never return password or hash)
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        phone: savedUser.phone,
        address: savedUser.address,
        createdAt: savedUser.createdAt
      }
    });
  } catch (error) {
    // Handle MongoDB duplicate key index error (code 11000 for unique email constraint)
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email address already exists"
      });
    }

    // Handle Mongoose schema validation errors (e.g. invalid email format)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        message: "Validation failed",
        errors: messages
      });
    }

    // Safe unexpected error handling without exposing stack trace or database internals
    console.error("Error in registerUser:", error.message);
    return res.status(500).json({
      message: "Registration failed due to a server error. Please try again later."
    });
  }
};

/**
 * @desc    Authenticate user & login
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    // Guard against missing, null, array, or non-object request body
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Invalid request body. A JSON object is required"
      });
    }

    const { email, password } = req.body;

    // Validate email presence and non-empty string
    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        message: "Email address is required"
      });
    }

    // Validate password presence and non-empty string
    if (!password || typeof password !== "string" || !password.trim()) {
      return res.status(400).json({
        message: "Password is required"
      });
    }

    // Normalize email consistently with registration (trim and lowercase)
    const normalizedEmail = email.trim().toLowerCase();

    // Query user by email in database
    const user = await User.findOne({ email: normalizedEmail });

    // If user does not exist, return generic 401 Unauthorized to prevent email enumeration
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Verify submitted password against stored bcrypt hash
    const isMatch = await bcrypt.compare(password, user.password);

    // If password does not match, return identical generic 401 Unauthorized
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Return HTTP 200 OK with safe user information only (never expose password or password hash)
    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    // Safe unexpected error handling without exposing stack trace or database internals
    console.error("Error in loginUser:", error.message);
    return res.status(500).json({
      message: "Login failed due to a server error. Please try again later."
    });
  }
};

module.exports = {
  registerUser,
  loginUser
};
