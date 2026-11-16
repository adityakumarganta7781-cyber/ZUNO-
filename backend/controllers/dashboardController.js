
const User = require("../models/User");
const Connection = require("../models/Connection");
const Community = require("../models/Community");
const Resource = require("../models/Resource");
const Notification = require("../models/Notification");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      user,
      totalConnections,
      pendingRequests,
      communitiesJoined,
      publishedResources,
      myResources,
      savedResources,
      unreadNotifications,
      recentNotifications,
      totalConversations,
      unreadMessages,
      recentMessages
    ] = await Promise.all([
      User.findById(userId).select(
        "name email university universityId course year bio skills interests profileImage role"
      ),

      Connection.countDocuments({
        $or: [
          { requester: userId, status: "accepted" },
          { recipient: userId, status: "accepted" }
        ]
      }),

      Connection.countDocuments({
        recipient: userId,
        status: "pending"
      }),

      Community.countDocuments({
        members: userId,
        isActive: true
      }),

      Resource.countDocuments({
        isPublished: true
      }),

      Resource.countDocuments({
        uploadedBy: userId
      }),

      Resource.countDocuments({
        bookmarks: userId,
        isPublished: true
      }),

      Notification.countDocuments({
        recipient: userId,
        isRead: false
      }),

      Notification.find({
        recipient: userId
      })
        .populate("sender", "name profileImage")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      Conversation.countDocuments({
        participants: userId
      }),

      Message.countDocuments({
        receiver: userId,
        isRead: false
      }),

      Message.find({
        $or: [
          { sender: userId },
          { receiver: userId }
        ]
      })
        .populate("sender", "name profileImage")
        .populate("receiver", "name profileImage")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Dashboard data retrieved successfully",

      dashboard: {
        profile: user,

        statistics: {
          totalConnections,
          pendingRequests,
          communitiesJoined,
          publishedResources,
          myResources,
          savedResources,
          unreadNotifications,
          totalConversations,
          unreadMessages
        },

        recentNotifications,
        recentMessages
      }
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve dashboard data"
    });
  }
};

module.exports = {
  getDashboard
};
