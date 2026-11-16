
const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ recipient: req.user._id })
        .populate("sender", "name profileImage")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),

      Notification.countDocuments({ recipient: req.user._id }),

      Notification.countDocuments({
        recipient: req.user._id,
        isRead: false
      })
    ]);

    return res.status(200).json({
      success: true,
      total,
      unreadCount,
      page,
      pages: Math.ceil(total / limit),
      notifications
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve notifications"
    });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipient: req.user._id
      },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update notification"
    });
  }
};

exports.markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update notifications"
    });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete notification"
    });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { recipient, type, title, message, link } = req.body;

    if (!recipient || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "Recipient, title and message are required"
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    const notification = await Notification.create({
      recipient,
      type: type || "system",
      title,
      message,
      link: link || ""
    });

    return res.status(201).json({
      success: true,
      message: "Notification created successfully",
      notification
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create notification"
    });
  }
};
