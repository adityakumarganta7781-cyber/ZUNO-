
const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getMyEvents,
  getEventAttendees
} = require("../controllers/eventController");

router.use(protect);

router.get("/", getEvents);
router.get("/my-registrations", getMyRegistrations);
router.get("/my-events", getMyEvents);

router.post("/", createEvent);

router.get("/:eventId", getEventById);
router.put("/:eventId", updateEvent);
router.delete("/:eventId", deleteEvent);

router.post("/:eventId/register", registerForEvent);
router.delete("/:eventId/register", cancelRegistration);

router.get("/:eventId/attendees", getEventAttendees);

module.exports = router;
