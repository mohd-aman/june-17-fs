const express = require("express");
const {
  getAllShows,
  getShowById,
  getShowsByTheatre,
  getShowsByMovie,
  createShow,
  updateShow,
  deleteShow,
  getShowsByOwner,
} = require("../controllers/showController");
const {
  authMiddleware,
  authorizationRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllShows);
router.get("/:id", getShowById);
router.get("/theatre/:theatreId", getShowsByTheatre);
router.get("/movie/:movieId", getShowsByMovie);

//partner protected routes
router.get("/my/shows",authMiddleware,authorizationRoles("partner"),getShowsByOwner)
router.post("/", authMiddleware, authorizationRoles("partner"), createShow);
router.put("/:id", authMiddleware, authorizationRoles("partner"), updateShow);
router.delete(
  "/:id",
  authMiddleware,
  authorizationRoles("partner"),
  deleteShow,
);

module.exports = router;