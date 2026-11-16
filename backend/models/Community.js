
const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    coverImage: {
      type: String,
      default: ""
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    moderators: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    joinRequests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "public"
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

communitySchema.index({ name: "text", description: "text", category: "text" });

module.exports = mongoose.model("Community", communitySchema);
