const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with original extension
  }
});

const upload = multer({ storage: storage });

// Public route to get all properties
router.get('/', propertyController.getProperties);

// Public route to get property by ID
router.get('/:id', propertyController.getPropertyById);

// Protected routes for owners and admin
router.post(
  '/',
  authenticateJWT,
  authorizeRoles('owner', 'admin'),
  upload.array('photos', 5), // Accept up to 5 photos
  propertyController.createProperty
);

router.put(
  '/:id',
  authenticateJWT,
  authorizeRoles('owner', 'admin'),
  upload.array('photos', 5),
  propertyController.updateProperty
);

router.delete('/:id', authenticateJWT, authorizeRoles('owner', 'admin'), propertyController.deleteProperty);

module.exports = router;
