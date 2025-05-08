const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateJWT } = require('../middleware/auth');

// Create a booking
router.post('/', authenticateJWT, bookingController.createBooking);

// Get bookings for logged-in user
router.get('/', authenticateJWT, bookingController.getUserBookings);

module.exports = router;
