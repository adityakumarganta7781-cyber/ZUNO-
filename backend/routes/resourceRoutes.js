
const express = require("express");
const protect = require("../middleware/auth");

const {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  toggleBookmark,
  getBookmarkedResources,
  trackDownload,
  getMyResources
} = require("../controllers/resourceController");

const router = express.Router();

router.use(protect);

router.get("/", getResources);
router.get("/my-resources", getMyResources);
router.get("/bookmarks", getBookmarkedResources);

router.post("/", createResource);

router.get("/:resourceId", getResourceById);
router.put("/:resourceId", updateResource);
router.delete("/:resourceId", deleteResource);

router.post("/:resourceId/bookmark", toggleBookmark);
router.post("/:resourceId/download", trackDownload);

module.exports = router;
