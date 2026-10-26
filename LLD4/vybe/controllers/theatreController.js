const Show = require("../models/showModel");
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
      err.name === "ValidationError" ||
      err.name === "CastError" ||
      err.code === 11000;

    res.status(isValidationError ? 400 : 500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

const getAllTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find({ isActive: true }).populate(
      "owner",
      "name email",
    );

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
    const theatre = await Theatre.findById(req.params.id).populate(
      "owner",
      "name email",
    );

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

    const updatedTheatre = await Theatre.findByIdAndUpdate(
      req.params.id,
      { ...updates, isActive: false },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Theatre updated successfully",
      data: updatedTheatre,
    });
  } catch (err) {
    const isValidationError =
      err.name === "ValidationError" ||
      err.name === "CastError" ||
      err.code === 11000;

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

    //check for existing shows
    const showCount = await Show.countDocuments({
      theatre: theatre._id,
      isActive: true,
    });
    if (showCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete theatre with existing shows. Remove all shows first.",
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

// Get all theatres for admin (with optional status filter)
const getAllTheatresAdmin = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status === "pending") {
      filter.isActive = false;
    } else if (req.query.status === "active") {
      filter.isActive = true;
    }
    // If no status query param, filter is empty = return all
    const theatres = await Theatre.find(filter).populate("owner", "name email");
    res.status(200).json({
      success: true,
      message: "Theatres fetched successfully",
      data: theatres,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Oops, Something went wrong",
    });
  }
};

const approveTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: "Theatre not found",
      });
    }
    if (theatre.isActive) {
      return res.status(400).json({
        success: false,
        message: "Theatre is already approved",
      });
    }
    theatre.isActive = true; //it is locally not saved in db
    await theatre.save();
    res.status(200).json({
      success: true,
      message: "Theatre approved successfully",
      data: theatre,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const rejectTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.params.id);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: "Theatre not found",
      });
    }

    if (!theatre.isActive) {
      return res.status(400).json({
        success: false,
        message: "Theatre is already inactive or has not been approved",
      });
    }

    theatre.isActive = false;
    await theatre.save();

    //Deactivate all shows at this theatre
    await Show.updateMany({ theatre: theatre._id }, { isActive: false });

    res.status(200).json({
      success: true,
      message:
        "Theatre rejected successfully, All associated shows have been deactivated.",
      data: theatre,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getAllTheatreByOwner = async (req, res) => {
  try {
    const filter = { owner: req.user.userId };
    if (req.query.status === "pending") {
      filter.isActive = false;
    } else if (req.query.status === "active") {
      filter.isActive = true;
    }
    const theatres = await Theatre.find(filter);
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

module.exports = {
  createTheatre,
  getAllTheatres,
  getTheatreById,
  updateTheatre,
  deleteTheatre,
  approveTheatre,
  rejectTheatre,
  getAllTheatresAdmin,
  getAllTheatreByOwner,
};
