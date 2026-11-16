
const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      default: ""
    },
    city: {
      type: String,
      default: ""
    },
    website: {
      type: String,
      default: ""
    },
    logo: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    establishedYear: {
      type: Number,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("University", universitySchema);
