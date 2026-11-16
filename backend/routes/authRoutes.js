
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const QRCode = require("qrcode");
const {
  generateSecret,
  generateURI,
  verify
} = require("otplib");

const User = require("../models/User");
const protect = require("../middleware/auth");

const {
  encryptSecret,
  decryptSecret,
  hashRecoveryCode,
  generateRecoveryCodes
} = require("../utils/securityUtils");

const router = express.Router();

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const clearCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/"
};

const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again later."
  }
});

const generateToken = (userId, sessionId, purpose) =>
  jwt.sign(
    { userId, sessionId, ...(purpose ? { purpose } : {}) },
    process.env.JWT_SECRET,
    { expiresIn: purpose ? "5m" : "7d" }
  );

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  university: user.university,
  course: user.course,
  year: user.year,
  bio: user.bio,
  skills: user.skills,
  interests: user.interests,
  profileImage: user.profileImage,
  role: user.role,
  twoFactorEnabled: user.twoFactorEnabled
});

const createSession = (req) => ({
  sessionId: crypto.randomUUID(),
  device: String(req.headers["user-agent"] || "Unknown device").slice(0, 200),
  ipAddress: String(req.ip || "").slice(0, 100),
  createdAt: new Date(),
  lastActiveAt: new Date()
});

const setSessionCookie = (res, user, session) => {
  const token = generateToken(
    user._id.toString(),
    session.sessionId
  );

  res.cookie("zuno_token", token, cookieOptions);
};

const verifyTotp = async (secret, token) => {
  if (!/^\d{6}$/.test(String(token || ""))) {
    return false;
  }

  const result = await verify({
    secret,
    token: String(token),
    epochTolerance: 30
  });

  return result.valid === true;
};

const verifyPassword = async (user, password) => {
  if (!password || typeof password !== "string") {
    return false;
  }

  return bcrypt.compare(password, user.password);
};

const requireSession = (req, res, next) => {
  if (!req.sessionId) {
    return res.status(401).json({
      success: false,
      message: "Valid session required"
    });
  }

  next();
};

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      university,
      course,
      year
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      name.trim().length < 2 ||
      password.length < 8
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid name and email. Password must contain at least 8 characters."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({
      email: normalizedEmail
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      university: university || "",
      course: course || "",
      year: year || ""
    });

    const session = createSession(req);
    user.sessions.push(session);
    await user.save();

    setSessionCookie(res, user, session);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: formatUser(user)
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
});

router.post("/login", sensitiveLimiter, async (req, res) => {
  try {
    const { email, password, twoFactorCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    }).select("+password +twoFactorSecret +recoveryCodes");

    if (
      !user ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive"
      });
    }

    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return res.status(200).json({
          success: true,
          requiresTwoFactor: true,
          message: "Enter your authenticator code"
        });
      }

      let verified = false;

      if (/^\d{6}$/.test(String(twoFactorCode))) {
        const secret = decryptSecret(user.twoFactorSecret);
        verified = await verifyTotp(secret, twoFactorCode);
      }

      if (!verified) {
        const recoveryHash = hashRecoveryCode(
          String(twoFactorCode).trim().toUpperCase()
        );

        const recoveryIndex = user.recoveryCodes.indexOf(recoveryHash);

        if (recoveryIndex !== -1) {
          user.recoveryCodes.splice(recoveryIndex, 1);
          verified = true;
        }
      }

      if (!verified) {
        return res.status(401).json({
          success: false,
          message: "Invalid authenticator or recovery code"
        });
      }
    }

    const session = createSession(req);
    user.sessions.push(session);
    await user.save();

    setSessionCookie(res, user, session);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: formatUser(user)
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});

router.get("/me", protect, (req, res) => {
  return res.status(200).json({
    success: true,
    user: formatUser(req.user)
  });
});

router.post("/logout", protect, requireSession, async (req, res) => {
  try {
    req.user.sessions = req.user.sessions.filter(
      (session) => session.sessionId !== req.sessionId
    );

    await req.user.save();
    res.clearCookie("zuno_token", clearCookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out from this device"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
});

router.put(
  "/change-password",
  protect,
  requireSession,
  sensitiveLimiter,
  async (req, res) => {
    try {
      const {
        currentPassword,
        newPassword,
        confirmPassword,
        revokeOtherSessions = false
      } = req.body;

      const user = await User.findById(req.user._id).select("+password");

      if (!(await verifyPassword(user, currentPassword))) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect"
        });
      }

      if (
        typeof newPassword !== "string" ||
        newPassword.length < 12
      ) {
        return res.status(400).json({
          success: false,
          message: "New password must contain at least 12 characters"
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "New passwords do not match"
        });
      }

      if (await bcrypt.compare(newPassword, user.password)) {
        return res.status(400).json({
          success: false,
          message: "New password must be different from the current password"
        });
      }

      user.password = await bcrypt.hash(newPassword, 12);
      user.passwordChangedAt = new Date();

      if (revokeOtherSessions === true) {
        user.sessions = user.sessions.filter(
          (session) => session.sessionId === req.sessionId
        );
      }

      await user.save();

      return res.status(200).json({
        success: true,
        message: "Password changed successfully",
        otherSessionsRevoked: revokeOtherSessions === true
      });
    } catch (error) {
      console.error("Password change error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Password change failed"
      });
    }
  }
);

router.get("/sessions", protect, requireSession, async (req, res) => {
  return res.status(200).json({
    success: true,
    sessions: req.user.sessions.map((session) => ({
      sessionId: session.sessionId,
      device: session.device,
      ipAddress: session.ipAddress,
      createdAt: session.createdAt,
      lastActiveAt: session.lastActiveAt,
      current: session.sessionId === req.sessionId
    }))
  });
});

router.delete(
  "/sessions/:sessionId",
  protect,
  requireSession,
  async (req, res) => {
    try {
      const sessionExists = req.user.sessions.some(
        (session) => session.sessionId === req.params.sessionId
      );

      if (!sessionExists) {
        return res.status(404).json({
          success: false,
          message: "Session not found"
        });
      }

      req.user.sessions = req.user.sessions.filter(
        (session) => session.sessionId !== req.params.sessionId
      );

      await req.user.save();

      if (req.params.sessionId === req.sessionId) {
        res.clearCookie("zuno_token", clearCookieOptions);
      }

      return res.status(200).json({
        success: true,
        message: "Session revoked successfully"
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Session revocation failed"
      });
    }
  }
);

router.post(
  "/logout-all",
  protect,
  requireSession,
  async (req, res) => {
    try {
      req.user.sessions = [];
      await req.user.save();

      res.clearCookie("zuno_token", clearCookieOptions);

      return res.status(200).json({
        success: true,
        message: "Logged out from all devices"
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Logout from all devices failed"
      });
    }
  }
);

router.post(
  "/2fa/setup",
  protect,
  requireSession,
  sensitiveLimiter,
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      if (user.twoFactorEnabled) {
        return res.status(400).json({
          success: false,
          message: "Two-factor authentication is already enabled"
        });
      }

      const secret = generateSecret();

      user.twoFactorPendingSecret = encryptSecret(secret);
      await user.save();

      const uri = generateURI({
        issuer: "ZUNO",
        label: user.email,
        secret
      });

      const qrCode = await QRCode.toDataURL(uri);

      return res.status(200).json({
        success: true,
        message: "Scan this QR code with your authenticator app",
        qrCode,
        manualEntryKey: secret
      });
    } catch (error) {
      console.error("2FA setup error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Could not initialize two-factor authentication"
      });
    }
  }
);

router.post(
  "/2fa/verify-setup",
  protect,
  requireSession,
  sensitiveLimiter,
  async (req, res) => {
    try {
      const { code } = req.body;

      const user = await User.findById(req.user._id)
        .select("+twoFactorPendingSecret +recoveryCodes");

      if (!user.twoFactorPendingSecret) {
        return res.status(400).json({
          success: false,
          message: "Start two-factor setup first"
        });
      }

      const secret = decryptSecret(user.twoFactorPendingSecret);
      const valid = await verifyTotp(secret, code);

      if (!valid) {
        return res.status(400).json({
          success: false,
          message: "Invalid authenticator code"
        });
      }

      const recoveryCodes = generateRecoveryCodes();

      user.twoFactorSecret = user.twoFactorPendingSecret;
      user.twoFactorPendingSecret = "";
      user.twoFactorEnabled = true;
      user.recoveryCodes = recoveryCodes.map(hashRecoveryCode);

      await user.save();

      return res.status(200).json({
        success: true,
        message: "Two-factor authentication enabled",
        recoveryCodes
      });
    } catch (error) {
      console.error("2FA verification error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Could not verify authenticator code"
      });
    }
  }
);

router.post(
  "/2fa/disable",
  protect,
  requireSession,
  sensitiveLimiter,
  async (req, res) => {
    try {
      const { currentPassword, code } = req.body;

      const user = await User.findById(req.user._id)
        .select("+password +twoFactorSecret +recoveryCodes");

      if (!(await verifyPassword(user, currentPassword))) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect"
        });
      }

      if (!user.twoFactorEnabled) {
        return res.status(400).json({
          success: false,
          message: "Two-factor authentication is not enabled"
        });
      }

      let valid = false;

      if (/^\d{6}$/.test(String(code || ""))) {
        valid = await verifyTotp(
          decryptSecret(user.twoFactorSecret),
          code
        );
      }

      if (!valid) {
        const recoveryHash = hashRecoveryCode(
          String(code || "").trim().toUpperCase()
        );

        const index = user.recoveryCodes.indexOf(recoveryHash);

        if (index !== -1) {
          user.recoveryCodes.splice(index, 1);
          valid = true;
        }
      }

      if (!valid) {
        return res.status(400).json({
          success: false,
          message: "Invalid authenticator or recovery code"
        });
      }

      user.twoFactorEnabled = false;
      user.twoFactorSecret = "";
      user.twoFactorPendingSecret = "";
      user.recoveryCodes = [];

      await user.save();

      return res.status(200).json({
        success: true,
        message: "Two-factor authentication disabled"
      });
    } catch (error) {
      console.error("2FA disable error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Could not disable two-factor authentication"
      });
    }
  }
);

router.get("/security-status", protect, (req, res) => {
  return res.status(200).json({
    success: true,
    security: {
      twoFactorEnabled: req.user.twoFactorEnabled,
      activeSessions: req.user.sessions.length,
      passwordChangedAt: req.user.passwordChangedAt
    }
  });
});

router.post("/reset-admin-password", async (req, res) => {
  try {
    const { resetSecret, newPassword } = req.body;

    if (
      !process.env.ADMIN_SETUP_SECRET ||
      resetSecret !== process.env.ADMIN_SETUP_SECRET
    ) {
      return res.status(403).json({
        success: false,
        message: "Invalid reset authorization"
      });
    }

    if (!newPassword || newPassword.length < 12) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 12 characters"
      });
    }

    const admin = await User.findOne({
      role: "admin"
    }).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found"
      });
    }

    admin.password = await bcrypt.hash(newPassword, 12);
    admin.passwordChangedAt = new Date();
    admin.sessions = [];

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Admin password reset successfully. All sessions were revoked."
    });
  } catch (error) {
    console.error("Admin reset error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Admin password reset failed"
    });
  }
});

module.exports = router;
