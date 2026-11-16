
const express = require("express");
const protect = require("../middleware/auth");

const {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  markMessagesRead,
  getUnreadCount
} = require("../controllers/messageController");

const router = express.Router();

router.use(protect);

router.get("/unread-count", getUnreadCount);

router.get("/conversations", getConversations);
router.post("/conversations/:userId", createConversation);

router.get("/conversations/:conversationId/messages", getMessages);
router.post("/conversations/:conversationId/messages", sendMessage);
router.patch("/conversations/:conversationId/read", markMessagesRead);

module.exports = router;
