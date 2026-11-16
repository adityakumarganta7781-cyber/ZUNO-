
const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    subject: {
      type: String,
      default: "",
      trim: true
    },
    tags: {
      type: [String],
      default: []
    },
    resourceType: {
      type: String,
      enum: ["notes", "ebook", "video", "article", "presentation", "question-paper", "other"],
      default: "other"
    },
    resourceUrl: {
      type: String,
      required: true,
      trim: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    bookmarks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    downloads: {
      type: Number,
      default: 0
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

resourceSchema.index({ title: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Resource", resourceSchema);
