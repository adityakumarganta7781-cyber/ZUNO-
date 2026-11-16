
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    const token =
      req.cookies?.zuno_token ||
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.sessionId || decoded.purpose) {
      return res.status(401).json({
        success: false,
        message: "Valid session required"
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user || user.isActive === false) {
      return res.status(401).json({
        success: false,
        message: "User not found or account inactive"
      });
    }

    const session = user.sessions?.find(
      item => item.sessionId === decoded.sessionId
    );

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expired or revoked. Please log in again."
      });
    }

    session.lastActiveAt = new Date();
    await user.save();

    req.user = user;
    req.sessionId = decoded.sessionId;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = protect;
