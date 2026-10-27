/**
 * FoodBridge - User Mongoose Model
 *
 * CA2 Syllabus Concepts Demonstrated:
 * - Mongoose Schema definition with strong type enforcement
 * - Field-level validations (required, minlength, maxlength, trim)
 * - Email normalization (lowercase) and regex format validation
 * - Database index-level uniqueness constraint (unique: true)
 * - Enum validation for role-based access control (donor, ngo, admin)
 * - Automatic schema timestamps (createdAt, updatedAt)
 */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Full Name or Organization Name (e.g., 'Raj Hotel', 'Hope Foundation')
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"]
    },

    // Email Address: Normalized to lowercase and enforced unique at database index level
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        "Please provide a valid email address"
      ]
    },

    // Password: Hashing with bcrypt will be added in the authentication milestone
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"]
    },

    // Role: Restricted strictly to the 3 roles supported by FoodBridge
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["donor", "ngo", "admin"],
        message: "{VALUE} is not a supported role. Supported roles: donor, ngo, admin"
      },
      default: "donor",
      lowercase: true,
      trim: true
    },

    // Optional contact details matching user profile references
    phone: {
      type: String,
      trim: true,
      default: ""
    },

    // Physical address of the organization / donor
    address: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    // Automatically manages createdAt and updatedAt
    timestamps: true
  }
);

// Create and export the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
