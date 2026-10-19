const express = require("express");
const {
  getAllTheatres,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre,
} = require("../controllers/theatreController");
const {
  authMiddleware,
  authorizationRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

//public routes
router.get("/", getAllTheatres);
router.get("/:id", getTheatreById);

//protected route partner only
router.post("/", authMiddleware, authorizationRoles("partner"), createTheatre);
router.put(
  "/:id",
  authMiddleware,
  authorizationRoles("partner"),
  updateTheatre,
);
router.delete(
  "/:id",
  authMiddleware,
  authorizationRoles("partner"),
  deleteTheatre,
);

module.exports = router;