const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    // BASIC INFORMATION
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 150,
    },

    // PASSWORD
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    // ADMIN ROLE
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
      required: true,
    },

    // ACCOUNT STATUS
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// PASSWORD HASHING
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

// PASSWORD COMPARISON
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// EXPORT MODEL
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
