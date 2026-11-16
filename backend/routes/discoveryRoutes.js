
const express = require("express");
const protect = require("../middleware/auth");

const {
  discoverStudents,
  getStudentProfile,
  sendConnectionRequest,
  respondToRequest,
  getConnectionRequests,
  getMyConnections,
  cancelConnectionRequest,
  removeConnection
} = require("../controllers/discoveryController");

const router = express.Router();

router.use(protect);

router.get("/", discoverStudents);
router.get("/requests", getConnectionRequests);
router.get("/connections", getMyConnections);

router.get("/students/:userId", getStudentProfile);
router.post("/connect/:userId", sendConnectionRequest);

router.patch("/requests/:connectionId", respondToRequest);
router.delete("/requests/:connectionId", cancelConnectionRequest);
router.delete("/connections/:connectionId", removeConnection);

module.exports = router;
