const express = require("express");
const {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} = require("../controllers/movieController");
const {
  authMiddleware,
  authorizationRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

//public end point
router.get("/", getAllMovies);
router.get("/:id", getMovieById);

//protected routes, add, update, delete movie - ADMIN only
router.post("/", authMiddleware, authorizationRoles("admin"), createMovie);
router.put("/:id", authMiddleware, authorizationRoles("admin"), updateMovie);
router.delete("/:id", authMiddleware, authorizationRoles("admin"), deleteMovie);

module.exports = router;
