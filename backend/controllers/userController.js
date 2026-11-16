
const User = require("../models/User");

const defaultPreferences = {
  emailNotifications: true,
  platformNotifications: true,
  eventUpdates: true,
  connectionRequests: true,
  startupUpdates: true,
  publicProfile: true,
  showUniversity: true,
  showEmail: false,
  language: "English"
};

const preferenceFields = Object.keys(defaultPreferences);

const getUserData = (user) => ({
  id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  university: user.university,
  course: user.course,
  year: user.year,
  bio: user.bio,
  website: user.website,
  skills: user.skills,
  interests: user.interests,
  profileImage: user.profileImage,
  preferences: {
    ...defaultPreferences,
    ...(user.preferences?.toObject?.() || user.preferences || {})
  },
  role: user.role
});

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user: getUserData(user)
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch profile"
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const allowedFields = [
      "name",
      "username",
      "university",
      "course",
      "year",
      "bio",
      "website",
      "skills",
      "interests",
      "profileImage"
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    }

    if (typeof user.name !== "string" || user.name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must contain at least 2 characters"
      });
    }

    if (req.body.preferences !== undefined) {
      if (
        !req.body.preferences ||
        typeof req.body.preferences !== "object" ||
        Array.isArray(req.body.preferences)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid preferences"
        });
      }

      const currentPreferences =
        user.preferences?.toObject?.() || user.preferences || {};

      const updatedPreferences = {
        ...defaultPreferences,
        ...currentPreferences
      };

      for (const field of preferenceFields) {
        if (req.body.preferences[field] !== undefined) {
          updatedPreferences[field] = req.body.preferences[field];
        }
      }

      for (const field of preferenceFields) {
        if (
          field !== "language" &&
          typeof updatedPreferences[field] !== "boolean"
        ) {
          return res.status(400).json({
            success: false,
            message: `Invalid value for ${field}`
          });
        }
      }

      if (!["English", "Telugu", "Hindi"].includes(updatedPreferences.language)) {
        return res.status(400).json({
          success: false,
          message: "Invalid language selection"
        });
      }

      user.preferences = updatedPreferences;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      user: getUserData(user)
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Settings update failed"
    });
  }
};
