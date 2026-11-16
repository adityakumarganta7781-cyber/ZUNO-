
const mongoose = require("mongoose");
const Resource = require("../models/Resource");

const getResources = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      subject = "",
      resourceType = "",
      page = 1,
      limit = 12
    } = req.query;

    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const pageLimit = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 50);

    const filter = {
      isPublished: true
    };

    if (search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    if (category.trim()) {
      filter.category = new RegExp(
        category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
    }

    if (subject.trim()) {
      filter.subject = new RegExp(
        subject.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
    }

    if (resourceType.trim()) {
      filter.resourceType = resourceType;
    }

    const [resources, total] = await Promise.all([
      Resource.find(filter)
        .populate("uploadedBy", "name profileImage university")
        .select("-bookmarks")
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * pageLimit)
        .limit(pageLimit),
      Resource.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      resources,
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
      message: "Unable to fetch resources"
    });
  }
};

const getResourceById = async (req, res) => {
  try {
    const { resourceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID"
      });
    }

    const resource = await Resource.findOne({
      _id: resourceId,
      isPublished: true
    })
      .populate("uploadedBy", "name profileImage university")
      .select("-bookmarks");

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found"
      });
    }

    res.status(200).json({
      success: true,
      resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch resource details"
    });
  }
};

const createResource = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subject,
      tags,
      resourceType,
      resourceUrl
    } = req.body;

    if (
      !title?.trim() ||
      !description?.trim() ||
      !category?.trim() ||
      !resourceUrl?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Title, description, category and resource URL are required"
      });
    }

    if (title.trim().length > 150 || description.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Title or description exceeds the allowed length"
      });
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(resourceUrl.trim());
    } catch {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid resource URL"
      });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        success: false,
        message: "Only HTTP and HTTPS resource URLs are allowed"
      });
    }

    const allowedTypes = [
      "notes",
      "ebook",
      "video",
      "article",
      "presentation",
      "question-paper",
      "other"
    ];

    const selectedType = resourceType || "other";

    if (!allowedTypes.includes(selectedType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource type"
      });
    }

    const resource = await Resource.create({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      subject: subject?.trim() || "",
      tags: Array.isArray(tags)
        ? tags.filter(tag => typeof tag === "string").map(tag => tag.trim()).filter(Boolean)
        : [],
      resourceType: selectedType,
      resourceUrl: parsedUrl.toString(),
      uploadedBy: req.user._id
    });

    await resource.populate("uploadedBy", "name profileImage university");

    res.status(201).json({
      success: true,
      message: "Resource published successfully",
      resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to publish resource"
    });
  }
};

const updateResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID"
      });
    }

    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found"
      });
    }

    if (
      resource.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this resource"
      });
    }

    const allowedFields = [
      "title",
      "description",
      "category",
      "subject",
      "tags",
      "resourceType",
      "resourceUrl",
      "isPublished"
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        resource[field] = req.body[field];
      }
    }

    if (resource.resourceUrl) {
      let parsedUrl;

      try {
        parsedUrl = new URL(resource.resourceUrl);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid resource URL"
        });
      }

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return res.status(400).json({
          success: false,
          message: "Only HTTP and HTTPS URLs are allowed"
        });
      }

      resource.resourceUrl = parsedUrl.toString();
    }

    await resource.save();
    await resource.populate("uploadedBy", "name profileImage university");

    res.status(200).json({
      success: true,
      message: "Resource updated successfully",
      resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update resource"
    });
  }
};

const deleteResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID"
      });
    }

    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found"
      });
    }

    if (
      resource.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this resource"
      });
    }

    await resource.deleteOne();

    res.status(200).json({
      success: true,
      message: "Resource deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to delete resource"
    });
  }
};

const toggleBookmark = async (req, res) => {
  try {
    const { resourceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID"
      });
    }

    const resource = await Resource.findOne({
      _id: resourceId,
      isPublished: true
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found"
      });
    }

    const userId = req.user._id;
    const alreadyBookmarked = resource.bookmarks.some(
      id => id.toString() === userId.toString()
    );

    if (alreadyBookmarked) {
      resource.bookmarks.pull(userId);
    } else {
      resource.bookmarks.addToSet(userId);
    }

    await resource.save();

    res.status(200).json({
      success: true,
      bookmarked: !alreadyBookmarked,
      message: alreadyBookmarked
        ? "Bookmark removed"
        : "Resource bookmarked successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update bookmark"
    });
  }
};

const getBookmarkedResources = async (req, res) => {
  try {
    const resources = await Resource.find({
      bookmarks: req.user._id,
      isPublished: true
    })
      .populate("uploadedBy", "name profileImage university")
      .select("-bookmarks")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      resources
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch bookmarked resources"
    });
  }
};

const trackDownload = async (req, res) => {
  try {
    const { resourceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID"
      });
    }

    const resource = await Resource.findOneAndUpdate(
      {
        _id: resourceId,
        isPublished: true
      },
      { $inc: { downloads: 1 } },
      { new: true }
    ).select("resourceUrl downloads");

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Download tracked",
      resourceUrl: resource.resourceUrl,
      downloads: resource.downloads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to track download"
    });
  }
};

const getMyResources = async (req, res) => {
  try {
    const resources = await Resource.find({
      uploadedBy: req.user._id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      resources
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch your resources"
    });
  }
};

module.exports = {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  toggleBookmark,
  getBookmarkedResources,
  trackDownload,
  getMyResources
};
