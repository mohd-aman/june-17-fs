const Theatre = require("../models/theatreModel");

const createTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.create({
      ...req.body,
      owner: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Theatre created successfully",
      data: theatre,
    });
  } catch (err) {
    const isValidationError =
      err.name === "ValidationError" || err.name === "CastError" || err.code === 11000;

    res.status(isValidationError ? 400 : 500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

const getAllTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find();

    res.status(200).json({
      success: true,
      message: "Theatres fetched successfully",
      data: theatres,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getTheatreById = async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.params.id);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: "Theatre not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Theatre fetched successfully",
      data: theatre,
    });
  } catch (err) {
    const isInvalidId = err.name === "CastError";

    res.status(isInvalidId ? 400 : 500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

const updateTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.params.id);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: "Theatre not found",
      });
    }

    if (theatre.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this theatre",
      });
    }

    const allowedFields = ["name", "address", "phone", "email"];
    const updates = {};

    for (const field of allowedFields) {
      if (Object.hasOwn(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    const updatedTheatre = await Theatre.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Theatre updated successfully",
      data: updatedTheatre,
    });
  } catch (err) {
    const isValidationError =
      err.name === "ValidationError" || err.name === "CastError" || err.code === 11000;

    res.status(isValidationError ? 400 : 500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

const deleteTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.params.id);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: "Theatre not found",
      });
    }

    if (theatre.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this theatre",
      });
    }

    await Theatre.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Theatre deleted successfully",
      data: theatre,
    });
  } catch (err) {
    const isInvalidId = err.name === "CastError";

    res.status(isInvalidId ? 400 : 500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

module.exports = {
  createTheatre,
  getAllTheatres,
  getTheatreById,
  updateTheatre,
  deleteTheatre,
};