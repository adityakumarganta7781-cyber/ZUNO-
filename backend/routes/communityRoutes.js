
const express = require("express");
const protect = require("../middleware/auth");

const {
  createCommunity,
  getCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
  getJoinRequests,
  respondToJoinRequest,
  createPost,
  getPosts,
  toggleLike,
  addComment,
  deleteCommunity
} = require("../controllers/communityController");

const router = express.Router();

router.use(protect);

router.get("/", getCommunities);
router.post("/", createCommunity);

router.get("/:communityId", getCommunityById);
router.delete("/:communityId", deleteCommunity);

router.post("/:communityId/join", joinCommunity);
router.post("/:communityId/leave", leaveCommunity);

router.get("/:communityId/requests", getJoinRequests);
router.patch("/:communityId/requests/:userId", respondToJoinRequest);

router.get("/:communityId/posts", getPosts);
router.post("/:communityId/posts", createPost);

router.post("/posts/:postId/like", toggleLike);
router.post("/posts/:postId/comments", addComment);

module.exports = router;
