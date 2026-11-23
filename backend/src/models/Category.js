const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    // Category name
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
    },

    // Category description
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },

    // Category icon
    icon: {
      type: String,
      trim: true,
      default: null,
    },

    // Department responsible for this category
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    // Maximum time allowed to resolve the complaint
    resolutionTime: {
      type: Number,
      required: true,
      min: 1,
    },

    // Resolution time unit
    resolutionTimeUnit: {
      type: String,
      enum: ["hours", "days"],
      default: "days",
      required: true,
    },

    // Category status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// DATABASE INDEXES
categorySchema.index({
  departmentId: 1,
  isActive: 1,
});

// EXPORT MODEL
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
