
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
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
      maxlength: 5000
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Workshop",
        "Hackathon",
        "Seminar",
        "Conference",
        "Cultural",
        "Competition",
        "Sports",
        "Networking",
        "Other"
      ]
    },
    bannerImage: {
      type: String,
      default: ""
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    venue: {
      type: String,
      required: true,
      trim: true
    },
    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      default: "Offline"
    },
    meetingLink: {
      type: String,
      default: ""
    },
    university: {
      type: String,
      default: ""
    },
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      default: null
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    organizerName: {
      type: String,
      required: true,
      trim: true
    },
    capacity: {
      type: Number,
      min: 1,
      default: 100
    },
    registrations: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        registeredAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    status: {
      type: String,
      enum: ["Draft", "Published", "Cancelled", "Completed"],
      default: "Published"
    },
    registrationDeadline: {
      type: Date,
      default: null
    },
    tags: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

eventSchema.index({ startDate: 1, status: 1 });
eventSchema.index({ category: 1, status: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ "registrations.user": 1 });

module.exports = mongoose.model("Event", eventSchema);
