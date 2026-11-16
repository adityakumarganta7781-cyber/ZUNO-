
const express = require("express");
const protect = require("../middleware/auth");

const {
  associateUniversity,
  getAssociatedUniversity
} = require("../controllers/associationController");

const router = express.Router();

router.put("/university", protect, associateUniversity);
router.get("/university", protect, getAssociatedUniversity);

module.exports = router;
