
const mongoose = require("mongoose");
const User = require("../models/User");
const Connection = require("../models/Connection");

const publicFields = "name university universityId course year bio skills interests profileImage";

const escapeRegex = value =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

exports.discoverStudents = async (req, res) => {
  try {
    const {
      search = "",
      university = "",
      course = "",
      skill = "",
      interest = "",
      page = 1,
      limit = 12
    } = req.query;

    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const pageLimit = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 50);

    const filter = {
      _id: { $ne: req.user._id },
      role: "student",
      isActive: { $ne: false }
    };

    if (search.trim()) {
      const pattern = new RegExp(escapeRegex(search.trim()), "i");
      filter.$or = [
        { name: pattern },
        { university: pattern },
        { course: pattern },
        { skills: pattern },
        { interests: pattern }
      ];
    }

    if (university.trim()) {
      filter.university = new RegExp(escapeRegex(university.trim()), "i");
    }

    if (course.trim()) {
      filter.course = new RegExp(escapeRegex(course.trim()), "i");
    }

    if (skill.trim()) {
      filter.skills = new RegExp(escapeRegex(skill.trim()), "i");
    }

    if (interest.trim()) {
      filter.interests = new RegExp(escapeRegex(interest.trim()), "i");
    }

    const [students, total] = await Promise.all([
      User.find(filter)
        .select(publicFields)
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * pageLimit)
        .limit(pageLimit),
      User.countDocuments(filter)
    ]);

    const ids = students.map(student => student._id);

    const connections = await Connection.find({
      $or: [
        { requester: req.user._id, recipient: { $in: ids } },
        { recipient: req.user._id, requester: { $in: ids } }
      ]
    }).select("requester recipient status");

    const connectionMap = new Map();

    connections.forEach(connection => {
      const otherId =
        connection.requester.toString() === req.user._id.toString()
          ? connection.recipient.toString()
          : connection.requester.toString();

      connectionMap.set(otherId, {
        status: connection.status,
        direction:
          connection.requester.toString() === req.user._id.toString()
            ? "sent"
            : "received"
      });
    });

    const results = students.map(student => ({
      ...student.toObject(),
      connection: connectionMap.get(student._id.toString()) || null
    }));

    res.json({
      success: true,
      students: results,
      pagination: {
        total,
        page: currentPage,
        limit: pageLimit,
        totalPages: Math.ceil(total / pageLimit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to discover students"
    });
  }
};

exports.getStudentProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID"
      });
    }

    const student = await User.findOne({
      _id: userId,
      role: "student",
      isActive: { $ne: false }
    }).select(publicFields);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const connection = await Connection.findOne({
      $or: [
        { requester: req.user._id, recipient: student._id },
        { requester: student._id, recipient: req.user._id }
      ]
    }).select("status requester recipient");

    res.json({
      success: true,
      student,
      connection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch student profile"
    });
  }
};

exports.sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID"
      });
    }

    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot connect with yourself"
      });
    }

    const recipient = await User.findOne({
      _id: userId,
      role: "student",
      isActive: { $ne: false }
    });

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const existing = await Connection.findOne({
      $or: [
        { requester: req.user._id, recipient: recipient._id },
        { requester: recipient._id, recipient: req.user._id }
      ]
    });

    if (existing) {
      if (existing.status === "rejected") {
        if (existing.requester.toString() === req.user._id.toString()) {
          await existing.deleteOne();
        } else {
          existing.requester = req.user._id;
          existing.recipient = recipient._id;
          existing.status = "pending";
          await existing.save();

          return res.status(200).json({
            success: true,
            message: "Connection request sent",
            connection: existing
          });
        }
      } else {
        return res.status(409).json({
          success: false,
          message: "A connection request or connection already exists",
          connection: existing
        });
      }
    }

    const connection = await Connection.create({
      requester: req.user._id,
      recipient: recipient._id
    });

    res.status(201).json({
      success: true,
      message: "Connection request sent",
      connection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to send connection request"
    });
  }
};

exports.respondToRequest = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const { action } = req.body;

    if (!mongoose.Types.ObjectId.isValid(connectionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid connection ID"
      });
    }

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be accept or reject"
      });
    }

    const connection = await Connection.findOne({
      _id: connectionId,
      recipient: req.user._id,
      status: "pending"
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "Pending connection request not found"
      });
    }

    connection.status = action === "accept" ? "accepted" : "rejected";
    await connection.save();

    res.json({
      success: true,
      message: `Connection request ${action}ed`,
      connection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to respond to connection request"
    });
  }
};

exports.getConnectionRequests = async (req, res) => {
  try {
    const [received, sent] = await Promise.all([
      Connection.find({
        recipient: req.user._id,
        status: "pending"
      }).populate("requester", publicFields).sort({ createdAt: -1 }),

      Connection.find({
        requester: req.user._id,
        status: "pending"
      }).populate("recipient", publicFields).sort({ createdAt: -1 })
    ]);

    res.json({
      success: true,
      received,
      sent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch connection requests"
    });
  }
};

exports.getMyConnections = async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [
        { requester: req.user._id },
        { recipient: req.user._id }
      ],
      status: "accepted"
    })
      .populate("requester", publicFields)
      .populate("recipient", publicFields)
      .sort({ updatedAt: -1 });

    const students = connections.map(connection => ({
      connectionId: connection._id,
      student:
        connection.requester._id.toString() === req.user._id.toString()
          ? connection.recipient
          : connection.requester,
      connectedAt: connection.updatedAt
    }));

    res.json({
      success: true,
      connections: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch connections"
    });
  }
};

exports.cancelConnectionRequest = async (req, res) => {
  try {
    const { connectionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(connectionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid connection ID"
      });
    }

    const connection = await Connection.findOneAndDelete({
      _id: connectionId,
      requester: req.user._id,
      status: "pending"
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "Pending sent request not found"
      });
    }

    res.json({
      success: true,
      message: "Connection request cancelled"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to cancel request"
    });
  }
};

exports.removeConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(connectionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid connection ID"
      });
    }

    const connection = await Connection.findOneAndDelete({
      _id: connectionId,
      status: "accepted",
      $or: [
        { requester: req.user._id },
        { recipient: req.user._id }
      ]
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "Connection not found"
      });
    }

    res.json({
      success: true,
      message: "Connection removed successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to remove connection"
    });
  }
};
