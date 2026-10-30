const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { searchShows } = require('../controllers/aiController');

const router = express.Router();

router.post("/search-shows",searchShows)

module.exports = router;