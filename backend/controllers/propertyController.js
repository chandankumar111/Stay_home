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

exports.getProperties = async (req, res) => {
  try {
    const filters = {};
    const { location, minPrice, maxPrice, type } = req.query;

    if (location) {
      filters['location.city'] = { $regex: location, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    if (type) {
      filters.type = type;
    }

    // If user role is owner, filter properties by owner id
    if (req.user.role === 'owner') {
      filters.owner = req.user.id;
    }

    const properties = await Property.find(filters).populate('owner', 'name email username');
    res.json(properties);
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
    } else if (req.body.photos === undefined) {
      // If photos field is undefined (removed all photos), set to empty array
      req.body.photos = [];
    }

    // Parse location coordinates if sent as string
    if (req.body.location && typeof req.body.location === 'string') {
      try {
        req.body.location = JSON.parse(req.body.location);
      } catch (e) {
        // ignore parse error
      }
    } else if ((!req.body.location || Object.keys(req.body.location).length === 0) && req.body.latitude && req.body.longitude) {
      // If location is missing but latitude and longitude are provided, construct location object
      req.body.location = {
        latitude: parseFloat(req.body.latitude),
        longitude: parseFloat(req.body.longitude),
      };
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
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property deleted' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
