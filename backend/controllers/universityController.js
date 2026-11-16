
const University = require("../models/University");

exports.createUniversity = async (req, res) => {
  try {
    const { name, code, country } = req.body;

    if (!name || !code || !country) {
      return res.status(400).json({
        success: false,
        message: "Name, code and country are required"
      });
    }

    const existing = await University.findOne({
      code: code.toUpperCase()
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "University code already exists"
      });
    }

    const university = await University.create(req.body);

    res.status(201).json({
      success: true,
      message: "University created successfully",
      university
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to create university"
    });
  }
};

exports.getUniversities = async (req, res) => {
  try {
    const universities = await University.find({
      isActive: true
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: universities.length,
      universities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch universities"
    });
  }
};

exports.getUniversityById = async (req, res) => {
  try {
    const university = await University.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!university) {
      return res.status(404).json({
        success: false,
        message: "University not found"
      });
    }

    res.status(200).json({
      success: true,
      university
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid university ID"
    });
  }
};

exports.updateUniversity = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "country",
      "state",
      "city",
      "website",
      "logo",
      "description",
      "establishedYear",
      "isActive"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const university = await University.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!university) {
      return res.status(404).json({
        success: false,
        message: "University not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "University updated successfully",
      university
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "University update failed"
    });
  }
};

exports.deleteUniversity = async (req, res) => {
  try {
    const university = await University.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!university) {
      return res.status(404).json({
        success: false,
        message: "University not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "University deactivated successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "University deletion failed"
    });
  }
};
