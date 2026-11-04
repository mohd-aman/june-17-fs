const express = require('express');
const { register, login, getCurrentUser,forgetPassword, resetPassword } = require("../controllers/authController");
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/register",register)
router.post("/login",login)
router.post("/forget-password",forgetPassword)
router.post("/reset-password/:token",resetPassword)
//protected route
router.get("/current-user",authMiddleware,getCurrentUser)

module.exports = router;