const Movie = require("../models/movieModel");

// Create a movie (Admin only)
const createMovie = async (req, res) => {
  try {
    const { title, description, genre, language, releaseDate, rating, poster } = req.body;

    if (!title || !description || !genre || !releaseDate) {
      return res.status(400).json({
        success: false,
        message: "Title, description, genre, and release date are required",
      });
    }

    const movie = await Movie.create({
      title,
      description,
      genre,
      language,
      releaseDate,
      rating,
      poster,
    });

    res.status(201).json({
      success: true,
      message: "Movie created successfully",
      data: movie,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

// Get all movies (Public)
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();

    res.status(200).json({
      success: true,
      message: "Movies fetched successfully",
      data: movies,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Get a single movie by ID (Public)
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Movie fetched successfully",
      data: movie,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Update a movie (Admin only)
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      data: movie,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

// Delete a movie (Admin only)
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
      data: movie,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
};