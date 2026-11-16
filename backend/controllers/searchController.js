
const User = require("../models/User");
const University = require("../models/University");
const Community = require("../models/Community");
const CommunityPost = require("../models/CommunityPost");
const Resource = require("../models/Resource");

const globalSearch = async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();

    if (query.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must contain at least 2 characters.",
      });
    }

    if (query.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Search query cannot exceed 100 characters.",
      });
    }

    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(safeQuery, "i");

    const currentUserId = req.user?._id || req.user?.id;

    const [students, universities, communities, resources] =
      await Promise.all([
        User.find({
          ...(currentUserId ? { _id: { $ne: currentUserId } } : {}),
          isActive: true,
          $or: [
            { name: regex },
            { university: regex },
            { course: regex },
            { bio: regex },
            { skills: regex },
            { interests: regex },
          ],
        })
          .select(
            "name university universityId course year bio skills interests profileImage"
          )
          .limit(5)
          .lean(),

        University.find({
          isActive: true,
          $or: [
            { name: regex },
            { code: regex },
            { city: regex },
            { state: regex },
            { country: regex },
            { description: regex },
          ],
        })
          .select(
            "name code city state country description logo website establishedYear"
          )
          .limit(5)
          .lean(),

        Community.find({
          isActive: true,
          privacy: "public",
          $or: [
            { name: regex },
            { description: regex },
            { category: regex },
          ],
        })
          .select("name description category coverImage members privacy")
          .limit(5)
          .lean(),

        Resource.find({
          isPublished: true,
          $or: [
            { title: regex },
            { description: regex },
            { category: regex },
            { subject: regex },
            { tags: regex },
          ],
        })
          .populate("uploadedBy", "name profileImage")
          .limit(5)
          .lean(),
      ]);

    const publicCommunityIds = await Community.find({
      isActive: true,
      privacy: "public",
    }).distinct("_id");

    const posts = await CommunityPost.find({
      community: { $in: publicCommunityIds },
      content: regex,
    })
      .populate("author", "name profileImage")
      .populate("community", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const results = {
      students: students.map((student) => ({
        id: student._id,
        type: "student",
        title: student.name,
        description: [
          student.course,
          student.university,
          student.year,
        ]
          .filter(Boolean)
          .join(" · "),
        image: student.profileImage,
        href: `/details/student/${student._id}`,
      })),

      universities: universities.map((university) => ({
        id: university._id,
        type: "university",
        title: university.name,
        description: [
          university.code,
          university.city,
          university.state,
          university.country,
        ]
          .filter(Boolean)
          .join(" · "),
        image: university.logo,
        href: `/details/university/${university._id}`,
      })),

      communities: communities.map((community) => ({
        id: community._id,
        type: "community",
        title: community.name,
        description: community.description,
        category: community.category,
        image: community.coverImage,
        membersCount: community.members?.length || 0,
        href: `/details/community/${community._id}`,
      })),

      posts: posts.map((post) => ({
        id: post._id,
        type: "post",
        title: post.author?.name || "Community Member",
        description: post.content,
        image: post.author?.profileImage || "",
        community: post.community?.name || "",
        communityId: post.community?._id,
        href: `/details/post/${post._id}?communityId=${post.community?._id}`,
      })),

      resources: resources.map((resource) => ({
        id: resource._id,
        type: "resource",
        title: resource.title,
        description: resource.description,
        category: resource.category,
        subject: resource.subject,
        resourceType: resource.resourceType,
        resourceUrl: resource.resourceUrl,
        uploadedBy: resource.uploadedBy?.name || "ZUNO Member",
        href: `/details/resource/${resource._id}`,
      })),
    };

    const totalResults = Object.values(results).reduce(
      (total, category) => total + category.length,
      0
    );

    return res.status(200).json({
      success: true,
      message: "Search completed successfully.",
      query,
      totalResults,
      results,
    });
  } catch (error) {
    console.error("Global Search Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while searching.",
    });
  }
};

module.exports = { globalSearch };
