const express = require('express');
const { register, login, getCurrentUser,forgetPassword, resetPassword } = require("../controllers/authController");
const { authMiddleware } = require('../middleware/authMiddleware');
const { loginLimiter, forgotPasswordRateLimiter } = require('../middleware/rateLimiters');
const requireStrings = require('../middleware/requireStrings');

const router = express.Router();

router.post("/register",requireStrings("name","email","password"),register);
router.post("/login",loginLimiter,requireStrings("password","email"),login);
router.post("/forget-password",forgotPasswordRateLimiter,requireStrings("email"),forgetPassword)
router.post("/reset-password/:token",resetPassword)
//protected route
router.get("/current-user",authMiddleware,getCurrentUser)

module.exports = router;