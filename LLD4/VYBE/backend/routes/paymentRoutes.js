const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { createPaymentIntent, verifyPayment } = require('../controllers/paymentController');

const router = express.Router();

router.post("/create-payment-intent",authMiddleware,createPaymentIntent);
router.post("/verify-payment",authMiddleware,verifyPayment)

module.exports = router;