const express = require("express");
const { authMiddleware, authorizationRoles } = require("../middleware/authMiddleware");
const { getAllTheatresAdmin, approveTheatre, rejectTheatre } = require("../controllers/theatreController");
const router = express.Router();

// All admin routes require auth + admin role
router.use(authMiddleware);
router.use(authorizationRoles('admin'));

//Theatre management
router.get("/theatres",getAllTheatresAdmin);
router.put("/theatre/approve/:id",approveTheatre);
router.put("/theatre/reject/:id",rejectTheatre);


module.exports = router;
