
const mongoose = require("mongoose");
const User = require("../models/User");
const University = require("../models/University");

const associateUniversity = async (req, res) => {
  try {
    const { universityId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(universityId)) {
      return res.status(400).json({
        success: false,
        message: "A valid university ID is required"
      });
    }

    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can associate with a university"
      });
    }

    const university = await University.findOne({
      _id: universityId,
      isActive: true
    });

    if (!university) {
      return res.status(404).json({
        success: false,
        message: "Active university not found"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        universityId: university._id,
        university: university.name
      },
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "University associated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        universityId: user.universityId
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to associate university",
      error: error.message
    });
  }
};

const getAssociatedUniversity = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("universityId", "name code country state city website logo");

    if (!user || !user.universityId) {
      return res.status(404).json({
        success: false,
        message: "No university associated with this student"
      });
    }

    return res.status(200).json({
      success: true,
      university: user.universityId
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve associated university",
      error: error.message
    });
  }
};

module.exports = {
  associateUniversity,
  getAssociatedUniversity
};
