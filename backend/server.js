
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const universityRoutes = require("./routes/universityRoutes");
const associationRoutes = require("./routes/associationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const discoveryRoutes = require("./routes/discoveryRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const communityRoutes = require("./routes/communityRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const searchRoutes = require("./routes/searchRoutes");
const eventRoutes = require("./routes/eventRoutes");

const User = require("./models/User");
const Conversation = require("./models/Conversation");

const app = express();
const httpServer = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

app.use(helmet());

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PATCH"],
    credentials: true
  }
});

app.set("io", io);

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.isActive === false) {
      return next(new Error("Unauthorized user"));
    }

    socket.userId = user._id.toString();
    next();
  } catch (error) {
    next(new Error("Invalid or expired token"));
  }
});

io.on("connection", socket => {
  socket.join(`user:${socket.userId}`);

  socket.on("join_conversation", async ({ conversationId } = {}) => {
    try {
      if (!conversationId) return;

      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: socket.userId
      });

      if (conversation) {
        socket.join(`conversation:${conversationId}`);
      }
    } catch (error) {
      socket.emit("socket_error", {
        message: "Unable to join conversation"
      });
    }
  });

  socket.on("leave_conversation", ({ conversationId } = {}) => {
    if (conversationId) {
      socket.leave(`conversation:${conversationId}`);
    }
  });

  socket.on("typing", ({ conversationId, isTyping } = {}) => {
    if (!conversationId) return;

    socket.to(`conversation:${conversationId}`).emit("user_typing", {
      conversationId,
      userId: socket.userId,
      isTyping: Boolean(isTyping)
    });
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to ZUNO API"
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ZUNO backend is healthy"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/associations", associationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/discovery", discoveryRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/events", eventRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    requestedUrl: req.originalUrl
  });
});

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from .env");
    }

    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(`ZUNO backend running on port ${PORT}`);
      console.log("ZUNO real-time messaging is enabled");
      console.log("ZUNO Knowledge Hub is enabled");
      console.log("ZUNO Communities is enabled");
      console.log("ZUNO Student Dashboard is enabled");
      console.log("ZUNO Global Search is enabled");
      console.log("ZUNO Events Module is enabled");
      console.log("ZUNO Cookie Authentication is enabled");
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
