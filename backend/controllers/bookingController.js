const Booking = require('../models/Booking');
const Property = require('../models/Property');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { propertyId, startDate, endDate, guests } = req.body;
    const userId = req.user.id;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Create booking
    const booking = new Booking({
      property: propertyId,
      user: userId,
      startDate,
      endDate,
      guests
    });

    await booking.save();
    res.status(201).json({ bookingId: booking._id, message: 'Booking created' });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get bookings for user
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ user: userId }).populate('property');
    res.json(bookings);
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
