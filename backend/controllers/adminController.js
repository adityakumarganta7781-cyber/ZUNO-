
const mongoose = require("mongoose");
const User = require("../models/User");
const University = require("../models/University");

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalAdmins,
      totalUniversities,
      activeStudents,
      inactiveStudents,
      recentUsers
    ] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "admin" }),
      University.countDocuments({ isActive: true }),
      User.countDocuments({ role: "student", isActive: { $ne: false } }),
      User.countDocuments({ role: "student", isActive: false }),
      User.find({ role: "student" })
        .select("name email university course createdAt isActive")
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalAdmins,
        totalUniversities,
        activeStudents,
        inactiveStudents
      },
      recentUsers
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics"
    });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const search = String(req.query.search || "").trim();
    const status = req.query.status;

    const filter = { role: "student" };

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escapedSearch, "i");

      filter.$or = [
        { name: regex },
        { email: regex },
        { university: regex },
        { course: regex }
      ];
    }

    if (status === "active") {
      filter.isActive = { $ne: false };
    } else if (status === "inactive") {
      filter.isActive = false;
    }

    const [students, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .populate("universityId", "name code")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      students
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve students"
    });
  }
};

exports.updateStudentStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID"
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false"
      });
    }

    const student = await User.findOneAndUpdate(
      { _id: req.params.id, role: "student" },
      { isActive },
      { new: true, runValidators: true }
    ).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: `Student account ${isActive ? "activated" : "deactivated"} successfully`,
      student
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update student status"
    });
  }
};
