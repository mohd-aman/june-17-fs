const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { searchShows,getRecommendationsForUser } = require('../controllers/aiController');

const router = express.Router();

router.post("/search-shows",authMiddleware,searchShows);
router.get("/recommendations",authMiddleware,getRecommendationsForUser)

module.exports = router;