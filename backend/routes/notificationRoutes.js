
const express = require("express");
const protect = require("../middleware/auth");

const {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  createNotification
} = require("../controllers/notificationController");

const router = express.Router();

router.use(protect);

router.get("/", getNotifications);
router.patch("/read-all", markAllNotificationsRead);
router.patch("/:id/read", markNotificationRead);
router.delete("/:id", deleteNotification);
router.post("/", createNotification);

module.exports = router;
