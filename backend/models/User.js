
const mongoose = require("mongoose");

const preferencesSchema = new mongoose.Schema(
  {
    emailNotifications: { type: Boolean, default: true },
    platformNotifications: { type: Boolean, default: true },
    eventUpdates: { type: Boolean, default: true },
    connectionRequests: { type: Boolean, default: true },
    startupUpdates: { type: Boolean, default: true },
    publicProfile: { type: Boolean, default: true },
    showUniversity: { type: Boolean, default: true },
    showEmail: { type: Boolean, default: false },
    language: {
      type: String,
      enum: ["English", "Telugu", "Hindi"],
      default: "English"
    }
  },
  { _id: false }
);

const sessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    device: { type: String, default: "Unknown device" },
    ipAddress: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    lastActiveAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, default: "", trim: true, maxlength: 30 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { type: String, required: true, select: false },

    university: { type: String, default: "" },
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      default: null
    },
    course: { type: String, default: "" },
    year: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 500 },
    website: { type: String, default: "" },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    profileImage: { type: String, default: "" },

    preferences: {
      type: preferencesSchema,
      default: () => ({})
    },

    sessions: {
      type: [sessionSchema],
      default: []
    },

    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: {
      type: String,
      default: "",
      select: false
    },
    twoFactorPendingSecret: {
      type: String,
      default: "",
      select: false
    },
    recoveryCodes: {
      type: [String],
      default: [],
      select: false
    },

    passwordChangedAt: {
      type: Date,
      default: null
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
