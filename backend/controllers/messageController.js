
const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate("participants", "name email profileImage university course")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch conversations" });
  }
};

const createConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "Cannot message yourself" });
    }

    const otherUser = await User.findById(userId);

    if (!otherUser || otherUser.isActive === false) {
      return res.status(404).json({ success: false, message: "User not found or inactive" });
    }

    const participants = [req.user._id, otherUser._id];

    let conversation = await Conversation.findOne({
      participants: { $all: participants, $size: 2 }
    });

    if (!conversation) {
      conversation = await Conversation.create({ participants });
    }

    await conversation.populate("participants", "name email profileImage university course");

    res.status(200).json({ success: true, conversation });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to create conversation" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ success: false, message: "Invalid conversation ID" });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 100);

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "name profileImage")
      .populate("receiver", "name profileImage")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      messages: messages.reverse(),
      page,
      limit
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch messages" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const text = typeof req.body.text === "string" ? req.body.text.trim() : "";

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ success: false, message: "Invalid conversation ID" });
    }

    if (!text || text.length > 5000) {
      return res.status(400).json({ success: false, message: "Message must contain 1 to 5000 characters" });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const receiverId = conversation.participants.find(
      id => id.toString() !== req.user._id.toString()
    );

    if (!receiverId) {
      return res.status(400).json({ success: false, message: "Recipient not found" });
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      receiver: receiverId,
      text
    });

    conversation.lastMessage = message._id;
    await conversation.save();

    await message.populate([
      { path: "sender", select: "name profileImage" },
      { path: "receiver", select: "name profileImage" }
    ]);

    const io = req.app.get("io");

    if (io) {
      io.to(`user:${receiverId}`).emit("new_message", message);
      io.to(`user:${req.user._id}`).emit("new_message", message);
    }

    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to send message" });
  }
};

const markMessagesRead = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ success: false, message: "Invalid conversation ID" });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const result = await Message.updateMany(
      {
        conversation: conversationId,
        receiver: req.user._id,
        isRead: false
      },
      { $set: { isRead: true, readAt: new Date() } }
    );

    const otherUserId = conversation.participants.find(
      id => id.toString() !== req.user._id.toString()
    );

    const io = req.app.get("io");

    if (io && otherUserId) {
      io.to(`user:${otherUserId}`).emit("messages_read", {
        conversationId,
        readerId: req.user._id.toString()
      });
    }

    res.json({ success: true, updated: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to mark messages as read" });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false
    });

    res.json({ success: true, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch unread count" });
  }
};

module.exports = {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  markMessagesRead,
  getUnreadCount
};
