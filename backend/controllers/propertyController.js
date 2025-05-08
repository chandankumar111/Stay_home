const Property = require('../models/Property');
const path = require('path');

// Create a new property
exports.createProperty = async (req, res) => {
  try {
    const propertyData = req.body;
    propertyData.owner = req.user.id; // Set owner from authenticated user

    // Handle uploaded photos
    if (req.files && req.files.length > 0) {
      propertyData.photos = req.files.map(file => '/uploads/' + file.filename);
    }

    // Parse location coordinates if sent as string
    if (propertyData.location && typeof propertyData.location === 'string') {
      try {
        propertyData.location = JSON.parse(propertyData.location);
      } catch (e) {
        // ignore parse error
      }
    }

    const property = new Property(propertyData);
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all properties with optional filters (e.g., location, price range)
exports.getProperties = async (req, res) => {
  try {
    const filters = {};
    // Add filters from query params if needed
    const properties = await Property.find(filters).populate('owner', 'name email');
    res.json(properties);
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email');
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update property by ID (owner only)
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Handle uploaded photos
    if (req.files && req.files.length > 0) {
      req.body.photos = req.files.map(file => '/uploads/' + file.filename);
    }

    // Parse location coordinates if sent as string
    if (req.body.location && typeof req.body.location === 'string') {
      try {
        req.body.location = JSON.parse(req.body.location);
      } catch (e) {
        // ignore parse error
      }
    }

    Object.assign(property, req.body);
    await property.save();
    res.json(property);
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete property by ID (owner or admin)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await property.remove();
    res.json({ message: 'Property deleted' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
