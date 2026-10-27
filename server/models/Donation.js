/**
 * FoodBridge - Donation Mongoose Model
 *
 * CA2 Syllabus Concepts Demonstrated:
 * - Mongoose Schema definition with strong type enforcement
 * - Built-in validations (required, enum, maxlength, trim)
 * - Mongoose ObjectId references (ref: 'User') for relational data
 * - Automatic schema timestamps (createdAt, updatedAt)
 */

const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    // Food Title / Name
    title: {
      type: String,
      required: [true, "Food title is required"],
      trim: true,
      maxlength: [100, "Food title cannot exceed 100 characters"]
    },

    // Category: restricted to the 4 categories established in CA1
    category: {
      type: String,
      required: [true, "Food category is required"],
      enum: {
        values: ["bakery", "produce", "prepared", "dairy"],
        message: "{VALUE} is not a valid category. Supported: bakery, produce, prepared, dairy"
      },
      lowercase: true,
      trim: true
    },

    // Quantity / Portions representation (e.g., '15 Boxes', '20 Loaves', '10 kg')
    quantity: {
      type: String,
      required: [true, "Quantity is required"],
      trim: true
    },

    // Expiry Date and Time
    expiry: {
      type: Date,
      required: [true, "Expiry date and time is required"]
    },

    // Description (max 250 characters matching the CA1 live character counter)
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [250, "Description cannot exceed 250 characters"]
    },

    // Pickup Location / Physical Address
    pickupLocation: {
      type: String,
      required: [true, "Pickup location is required"],
      trim: true
    },

    // Specific Pickup Instructions for Rescuers
    pickupInstructions: {
      type: String,
      required: [true, "Pickup instructions are required"],
      trim: true
    },

    // Status: Lifecycle state of the surplus item
    status: {
      type: String,
      enum: {
        values: ["available", "requested", "completed", "cancelled"],
        message: "{VALUE} is not a valid status"
      },
      default: "available",
      lowercase: true,
      trim: true
    },

    // Reference to the authenticated Donor (User model)
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Donor reference (User ObjectId) is required"]
    },

    // Denormalized donor name for fast display without mandatory populate
    donorName: {
      type: String,
      required: [true, "Donor name is required"],
      trim: true
    },

    // Image URL for food photo preview or placeholder
    imageUrl: {
      type: String,
      default: "",
      trim: true
    }
  },
  {
    // Automatically manages createdAt and updatedAt fields
    timestamps: true
  }
);

// Create and export the Donation model
const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
