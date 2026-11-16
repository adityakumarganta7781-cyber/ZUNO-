
const mongoose = require("mongoose");
const Community = require("../models/Community");
const CommunityPost = require("../models/CommunityPost");

const isMember = (community, userId) =>
  community.members.some(id => id.toString() === userId.toString());

const isModerator = (community, userId) =>
  community.moderators.some(id => id.toString() === userId.toString());

const canManage = (community, user) =>
  community.createdBy.toString() === user._id.toString() ||
  isModerator(community, user._id) ||
  user.role === "admin";

exports.createCommunity = async (req, res) => {
  try {
    const { name, description, category, coverImage, privacy } = req.body;

    if (!name?.trim() || !description?.trim() || !category?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name, description and category are required"
      });
    }

    if (privacy && !["public", "private"].includes(privacy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid community privacy"
      });
    }

    const community = await Community.create({
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      coverImage: coverImage || "",
      privacy: privacy || "public",
      createdBy: req.user._id,
      members: [req.user._id]
    });

    await community.populate("createdBy", "name profileImage university");

    res.status(201).json({
      success: true,
      message: "Community created successfully",
      community
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to create community"
    });
  }
};

exports.getCommunities = async (req, res) => {
  try {
    const { search = "", category = "", page = 1, limit = 12 } = req.query;

    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const pageLimit = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 50);

    const filter = { isActive: true };

    if (search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    if (category.trim()) {
      filter.category = new RegExp(
        category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
    }

    filter.$or = [
      { privacy: "public" },
      { privacy: "private", members: req.user._id }
    ];

    const [communities, total] = await Promise.all([
      Community.find(filter)
        .populate("createdBy", "name profileImage")
        .select("-joinRequests")
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * pageLimit)
        .limit(pageLimit),
      Community.countDocuments(filter)
    ]);

    res.json({
      success: true,
      communities,
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
      message: "Unable to fetch communities"
    });
  }
};

exports.getCommunityById = async (req, res) => {
  try {
    const { communityId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(communityId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid community ID"
      });
    }

    const community = await Community.findOne({
      _id: communityId,
      isActive: true
    })
      .populate("createdBy", "name profileImage university")
      .populate("members", "name profileImage university")
      .populate("moderators", "name profileImage");

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found"
      });
    }

    if (community.privacy === "private" && !isMember(community, req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You must be a member to view this private community"
      });
    }

    res.json({ success: true, community });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch community"
    });
  }
};

exports.joinCommunity = async (req, res) => {
  try {
    const community = await Community.findOne({
      _id: req.params.communityId,
      isActive: true
    });

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found"
      });
    }

    if (isMember(community, req.user._id)) {
      return res.status(409).json({
        success: false,
        message: "You are already a member"
      });
    }

    if (community.privacy === "private") {
      if (community.joinRequests.some(id => id.toString() === req.user._id.toString())) {
        return res.status(409).json({
          success: false,
          message: "Join request already submitted"
        });
      }

      community.joinRequests.addToSet(req.user._id);
      await community.save();

      return res.json({
        success: true,
        message: "Join request submitted"
      });
    }

    community.members.addToSet(req.user._id);
    await community.save();

    res.json({
      success: true,
      message: "Joined community successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to join community"
    });
  }
};

exports.leaveCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found"
      });
    }

    if (community.createdBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Community creator cannot leave. Transfer ownership or delete the community."
      });
    }

    community.members.pull(req.user._id);
    community.moderators.pull(req.user._id);
    community.joinRequests.pull(req.user._id);

    await community.save();

    res.json({
      success: true,
      message: "Left community successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to leave community"
    });
  }
};

exports.getJoinRequests = async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId)
      .populate("joinRequests", "name email profileImage university");

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found"
      });
    }

    if (!canManage(community, req.user)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    res.json({
      success: true,
      requests: community.joinRequests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch join requests"
    });
  }
};

exports.respondToJoinRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be accept or reject"
      });
    }

    const community = await Community.findById(req.params.communityId);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found"
      });
    }

    if (!canManage(community, req.user)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    const requested = community.joinRequests.some(
      id => id.toString() === userId
    );

    if (!requested) {
      return res.status(404).json({
        success: false,
        message: "Join request not found"
      });
    }

    community.joinRequests.pull(userId);

    if (action === "accept") {
      community.members.addToSet(userId);
    }

    await community.save();

    res.json({
      success: true,
      message: `Join request ${action}ed`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to process join request"
    });
  }
};

exports.createPost = async (req, res) => {
  try {
    const community = await Community.findOne({
      _id: req.params.communityId,
      isActive: true
    });

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found"
      });
    }

    if (!isMember(community, req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Join the community before posting"
      });
    }

    const content = typeof req.body.content === "string"
      ? req.body.content.trim()
      : "";

    if (!content || content.length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Post must contain 1 to 5000 characters"
      });
    }

    const post = await CommunityPost.create({
      community: community._id,
      author: req.user._id,
      content,
      image: req.body.image || ""
    });

    await post.populate("author", "name profileImage university");

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to create post"
    });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const community = await Community.findOne({
      _id: req.params.communityId,
      isActive: true
    });

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found"
      });
    }

    if (community.privacy === "private" && !isMember(community, req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You must be a member to view posts"
      });
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 50);

    const [posts, total] = await Promise.all([
      CommunityPost.find({ community: community._id })
        .populate("author", "name profileImage university")
        .populate("comments.user", "name profileImage")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      CommunityPost.countDocuments({ community: community._id })
    ]);

    res.json({
      success: true,
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch posts"
    });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    const community = await Community.findById(post.community);

    if (!community || (!isMember(community, req.user._id) && req.user.role !== "admin")) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to like this post"
      });
    }

    const alreadyLiked = post.likes.some(
      id => id.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.addToSet(req.user._id);
    }

    await post.save();

    res.json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update like"
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    const community = await Community.findById(post.community);

    if (!community || (!isMember(community, req.user._id) && req.user.role !== "admin")) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to comment"
      });
    }

    const text = typeof req.body.text === "string"
      ? req.body.text.trim()
      : "";

    if (!text || text.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Comment must contain 1 to 1000 characters"
      });
    }

    post.comments.push({
      user: req.user._id,
      text
    });

    await post.save();
    await post.populate("comments.user", "name profileImage");

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comments: post.comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to add comment"
    });
  }
};

exports.deleteCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found"
      });
    }

    if (
      community.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the creator or admin can delete this community"
      });
    }

    await CommunityPost.deleteMany({ community: community._id });
    await community.deleteOne();

    res.json({
      success: true,
      message: "Community and its posts deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to delete community"
    });
  }
};
