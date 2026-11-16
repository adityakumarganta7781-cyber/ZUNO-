
const express = require("express");
const protect = require("../middleware/auth");

const {
  getDashboardStats,
  getAllStudents,
  updateStudentStatus
} = require("../controllers/adminController");

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required"
    });
  }

  next();
};

router.use(protect, adminOnly);

router.get("/dashboard", getDashboardStats);
router.get("/students", getAllStudents);
router.patch("/students/:id/status", updateStudentStatus);

module.exports = router;
