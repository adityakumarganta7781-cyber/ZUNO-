
const mongoose = require("mongoose");
const Event = require("../models/Event");

const getUserId = (req) => req.user?._id || req.user?.id;

const isAdmin = (req) => req.user?.role === "admin";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const sendError = (res, status, message) => {
  return res.status(status).json({
    success: false,
    message
  });
};

const canManageEvent = (event, req) => {
  return (
    isAdmin(req) ||
    event.organizer.toString() === getUserId(req).toString()
  );
};

exports.createEvent = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return sendError(res, 403, "Only administrators can create events.");
    }

    const {
      title,
      description,
      category,
      bannerImage,
      startDate,
      endDate,
      venue,
      mode,
      meetingLink,
      university,
      universityId,
      capacity,
      registrationDeadline,
      tags,
      status
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !startDate ||
      !endDate ||
      !venue
    ) {
      return sendError(res, 400, "Please provide all required event details.");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end <= start
    ) {
      return sendError(res, 400, "Please provide valid event dates.");
    }

    if (
      registrationDeadline &&
      new Date(registrationDeadline) > start
    ) {
      return sendError(
        res,
        400,
        "Registration deadline cannot be after the event start date."
      );
    }

    if (universityId && !isValidId(universityId)) {
      return sendError(res, 400, "Invalid university ID.");
    }

    if (capacity !== undefined && (!Number.isInteger(Number(capacity)) || Number(capacity) < 1)) {
      return sendError(res, 400, "Capacity must be a positive whole number.");
    }

    const event = await Event.create({
      title,
      description,
      category,
      bannerImage,
      startDate: start,
      endDate: end,
      venue,
      mode,
      meetingLink,
      university,
      universityId: universityId || null,
      organizer: getUserId(req),
      organizerName: req.user.name,
      capacity: capacity === undefined ? 100 : Number(capacity),
      registrationDeadline: registrationDeadline || null,
      tags: Array.isArray(tags) ? tags : [],
      status: status === "Draft" ? "Draft" : "Published"
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully.",
      event
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

exports.getEvents = async (req, res) => {
  try {
    const {
      search,
      category,
      university,
      mode,
      status = "Published",
      page = 1,
      limit = 12,
      upcoming
    } = req.query;

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));

    const filter = {};

    if (status !== "all") {
      filter.status = status;
    }

    if (!isAdmin(req)) {
      filter.status = "Published";
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    if (mode && mode !== "all") {
      filter.mode = mode;
    }

    if (university) {
      filter.university = {
        $regex: university,
        $options: "i"
      };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { venue: { $regex: search, $options: "i" } },
        { university: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } }
      ];
    }

    if (upcoming === "true") {
      filter.startDate = { $gte: new Date() };
    }

    const [events, total] = await Promise.all([
      Event.find(filter)
        .populate("organizer", "name username profileImage university")
        .populate("universityId", "name")
        .sort({ startDate: 1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean(),

      Event.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      events
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!isValidId(eventId)) {
      return sendError(res, 400, "Invalid event ID.");
    }

    const event = await Event.findById(eventId)
      .populate("organizer", "name username profileImage university")
      .populate("universityId", "name")
      .populate("registrations.user", "name username profileImage");

    if (!event) {
      return sendError(res, 404, "Event not found.");
    }

    if (event.status !== "Published" && !canManageEvent(event, req)) {
      return sendError(res, 404, "Event not found.");
    }

    return res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!isValidId(eventId)) {
      return sendError(res, 400, "Invalid event ID.");
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return sendError(res, 404, "Event not found.");
    }

    if (!canManageEvent(event, req)) {
      return sendError(res, 403, "You are not authorized to update this event.");
    }

    const allowedFields = [
      "title",
      "description",
      "category",
      "bannerImage",
      "startDate",
      "endDate",
      "venue",
      "mode",
      "meetingLink",
      "university",
      "universityId",
      "capacity",
      "registrationDeadline",
      "tags",
      "status"
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    }

    if (event.universityId && !isValidId(event.universityId)) {
      return sendError(res, 400, "Invalid university ID.");
    }

    if (
      !Number.isInteger(Number(event.capacity)) ||
      Number(event.capacity) < 1
    ) {
      return sendError(res, 400, "Capacity must be a positive whole number.");
    }

    if (Number(event.capacity) < event.registrations.length) {
      return sendError(
        res,
        400,
        "Capacity cannot be less than the existing registration count."
      );
    }

    if (
      new Date(event.endDate) <= new Date(event.startDate) ||
      Number.isNaN(new Date(event.startDate).getTime()) ||
      Number.isNaN(new Date(event.endDate).getTime())
    ) {
      return sendError(res, 400, "Please provide valid event dates.");
    }

    if (
      event.registrationDeadline &&
      new Date(event.registrationDeadline) > new Date(event.startDate)
    ) {
      return sendError(
        res,
        400,
        "Registration deadline cannot be after the event start date."
      );
    }

    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event updated successfully.",
      event
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!isValidId(eventId)) {
      return sendError(res, 400, "Invalid event ID.");
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return sendError(res, 404, "Event not found.");
    }

    if (!canManageEvent(event, req)) {
      return sendError(res, 403, "You are not authorized to delete this event.");
    }

    await Event.findByIdAndDelete(eventId);

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully."
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = getUserId(req);

    if (!isValidId(eventId)) {
      return sendError(res, 400, "Invalid event ID.");
    }

    const now = new Date();

    const event = await Event.findOneAndUpdate(
      {
        _id: eventId,
        status: "Published",
        startDate: { $gt: now },
        $or: [
          { registrationDeadline: null },
          { registrationDeadline: { $gte: now } }
        ],
        "registrations.user": { $ne: userId },
        $expr: {
          $lt: [
            { $size: { $ifNull: ["$registrations", []] } },
            "$capacity"
          ]
        }
      },
      {
        $push: {
          registrations: {
            user: userId,
            registeredAt: now
          }
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!event) {
      const existing = await Event.findById(eventId);

      if (!existing) {
        return sendError(res, 404, "Event not found.");
      }

      if (existing.status !== "Published") {
        return sendError(res, 400, "This event is not open for registration.");
      }

      if (existing.startDate <= now) {
        return sendError(res, 400, "This event has already started.");
      }

      if (
        existing.registrationDeadline &&
        existing.registrationDeadline < now
      ) {
        return sendError(res, 400, "The registration deadline has passed.");
      }

      if (existing.registrations.some(
        (registration) => registration.user.toString() === userId.toString()
      )) {
        return sendError(res, 409, "You are already registered for this event.");
      }

      return sendError(res, 400, "This event has reached its registration capacity.");
    }

    return res.status(200).json({
      success: true,
      message: "You have successfully registered for this event.",
      registrationCount: event.registrations.length
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

exports.cancelRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!isValidId(eventId)) {
      return sendError(res, 400, "Invalid event ID.");
    }

    const event = await Event.findOneAndUpdate(
      {
        _id: eventId,
        startDate: { $gt: new Date() },
        "registrations.user": getUserId(req)
      },
      {
        $pull: {
          registrations: {
            user: getUserId(req)
          }
        }
      },
      { new: true }
    );

    if (!event) {
      return sendError(
        res,
        404,
        "Event not found, registration not found, or cancellation is closed."
      );
    }

    return res.status(200).json({
      success: true,
      message: "Your registration has been cancelled.",
      registrationCount: event.registrations.length
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

exports.getMyRegistrations = async (req, res) => {
  try {
    const events = await Event.find({
      "registrations.user": getUserId(req)
    })
      .populate("organizer", "name username profileImage")
      .sort({ startDate: 1 });

    return res.status(200).json({
      success: true,
      total: events.length,
      events
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({
      organizer: getUserId(req)
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: events.length,
      events
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

exports.getEventAttendees = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!isValidId(eventId)) {
      return sendError(res, 400, "Invalid event ID.");
    }

    const event = await Event.findById(eventId)
      .populate(
        "registrations.user",
        "name username email profileImage university course"
      );

    if (!event) {
      return sendError(res, 404, "Event not found.");
    }

    if (!canManageEvent(event, req)) {
      return sendError(res, 403, "You are not authorized to view attendees.");
    }

    return res.status(200).json({
      success: true,
      total: event.registrations.length,
      attendees: event.registrations
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
