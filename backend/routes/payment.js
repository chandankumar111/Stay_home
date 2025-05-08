const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateJWT } = require('../middleware/auth');

// Create Razorpay order
router.post('/create-order', authenticateJWT, paymentController.createOrder);

// Verify payment
router.post('/verify', authenticateJWT, paymentController.verifyPayment);

module.exports = router;
