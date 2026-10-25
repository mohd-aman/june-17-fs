const Show = require("../models/showModel");
const Theatre = require("../models/theatreModel");
const Movie = require("../models/movieModel");

const isBadRequestError = (err) =>
  err.name === "ValidationError" ||
  err.name === "CastError" ||
  err.code === 11000;

const sendError = (res, err) => {
  res.status(isBadRequestError(err) ? 400 : 500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
};

const createShow = async (req, res) => {
  try {
    const {
      movie,
      theatre: theatreId,
      date,
      time,
      totalSeats,
      ticketPrice,
    } = req.body;
    const movieExists = await Movie.findById(movie);

    if (!movieExists) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    const theatre = await Theatre.findById(theatreId);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: "Theatre not found",
      });
    }

    if (theatre.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create a show at this theatre",
      });
    }

    const show = await Show.create({
      movie,
      theatre: theatreId,
      date,
      time,
      totalSeats,
      availableSeats: totalSeats,
      ticketPrice,
    });

    res.status(201).json({
      success: true,
      message: "Show created successfully",
      data: show,
    });
  } catch (err) {
    sendError(res, err);
  }
};

const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find({isActive:true}).populate("movie").populate("theatre");

    res.status(200).json({
      success: true,
      message: "Shows fetched successfully",
      data: shows,
    });
  } catch (err) {
    sendError(res, err);
  }
};

const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate("movie")
      .populate("theatre");

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Show fetched successfully",
      data: show,
    });
  } catch (err) {
    sendError(res, err);
  }
};

const getShowsByTheatre = async (req, res) => {
  try {
    const shows = await Show.find({ theatre: req.params.theatreId, isActive:true})
      .populate("movie")
      .populate("theatre");

    res.status(200).json({
      success: true,
      message: "Shows fetched successfully",
      data: shows,
    });
  } catch (err) {
    sendError(res, err);
  }
};

const getShowsByMovie = async (req, res) => {
  try {
    const shows = await Show.find({ movie: req.params.movieId,isActive:true })
      .populate("movie")
      .populate("theatre");

    res.status(200).json({
      success: true,
      message: "Shows fetched successfully",
      data: shows,
    });
  } catch (err) {
    sendError(res, err);
  }
};

const updateShow = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    const theatre = await Theatre.findById(show.theatre);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: "Theatre not found",
      });
    }

    if (theatre.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this show",
      });
    }

    const allowedFields = [
      "movie",
      "theatre",
      "date",
      "time",
      "totalSeats",
      "ticketPrice",
    ];
    const updates = {};

    for (const field of allowedFields) {
      if (Object.hasOwn(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.hasOwn(updates, "totalSeats")) {
      const bookedSeats = show.totalSeats - show.availableSeats;

      if (updates.totalSeats < bookedSeats) {
        return res.status(400).json({
          success: false,
          message: "Total seats cannot be less than the number of booked seats",
        });
      }

      updates.availableSeats = updates.totalSeats - bookedSeats;
    }

    if (Object.hasOwn(updates, "theatre")) {
      const newTheatre = await Theatre.findById(updates.theatre);

      if (!newTheatre) {
        return res.status(404).json({
          success: false,
          message: "Theatre not found",
        });
      }

      if (newTheatre.owner.toString() !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to move this show to that theatre",
        });
      }
    }

    const updatedShow = await Show.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Show updated successfully",
      data: updatedShow,
    });
  } catch (err) {
    sendError(res, err);
  }
};

const deleteShow = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    const theatre = await Theatre.findById(show.theatre);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: "Theatre not found",
      });
    }

    if (theatre.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this show",
      });
    }

    await Show.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Show deleted successfully",
      data: show,
    });
  } catch (err) {
    sendError(res, err);
  }
};

const getAllShowsAdmin = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status === "pending") {
      filter.isActive = false;
    } else if (req.query.status === "active") {
      filter.isActive = true;
    }
    const shows = await Show.find(filter)
      .populate("movie", "title genre language")
      .populate("theatre", "name address");
    res.status(200).json({
      success: true,
      message: "Shows fetched successfully",
      data: shows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const approveShow = async(req,res)=>{
  try{
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    if (show.isActive) {
      return res.status(400).json({
        success: false,
        message: "Show is already approved",
      });
    }

    show.isActive = true; //locally change
    await show.save(); //save it to db

    res.status(200).json({
      success: true,
      message: "Show approved successfully",
      data: show,
    });

  }catch(err){
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

const rejectShow = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    if (!show.isActive) {
      return res.status(400).json({
        success: false,
        message: "Show is already inactive",
      });
    }

    show.isActive = false;
    await show.save();

    res.status(200).json({
      success: true,
      message: "Show rejected successfully",
      data: show,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getShowsByOwner = async(req,res)=>{
  try{
    //step1 :find all theatres of owned by this partner
    const theatres = await Theatre.find({owner:req.user.userId});
    const thearedIds = theatres.map((t)=>t._id);

    //steps 2: find all shows at these theatres;
    // theatreIds = [id1,id2,id3,id4..];
    const filter = {theatre:{$in:thearedIds}};

    if (req.query.status === "pending") {
      filter.isActive = false;
    } else if (req.query.status === "active") {
      filter.isActive = true;
    }
    console.log(filter);
    const shows = await Show.find(filter) .populate("movie", "title genre language")
      .populate("theatre", "name address");

    res.status(200).json({
      success: true,
      message: "Shows fetched successfully",
      data: shows,
    });
  }catch(err){
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}
module.exports = {
  createShow,
  getAllShows,
  getShowById,
  getShowsByTheatre,
  getShowsByMovie,
  updateShow,
  deleteShow,
  getAllShowsAdmin,
  approveShow,
  rejectShow,
  getShowsByOwner
};
