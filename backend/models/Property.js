/**
 * Property model for PG/Flat/Room listings
 */

const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  photos: [String], // URLs or paths to photos
  videos: [String], // URLs or paths to videos
  price: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['pg', 'flat', 'room'],
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: String
  },
  contactNumber: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

propertySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Property', propertySchema);
