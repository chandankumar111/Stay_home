import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
};

const EditListingModal = ({ open, onClose, listing, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    type: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (listing) {
      console.log('EditListingModal useEffect listing:', listing);
      let locationValue = '';
      if (typeof listing.location === 'string') {
        locationValue = listing.location;
      } else if (listing.location && typeof listing.location === 'object') {
        // If location is an object with latitude and longitude, convert to string "lat, lon"
        if (listing.location.latitude && listing.location.longitude) {
          locationValue = `${listing.location.latitude}, ${listing.location.longitude}`;
        } else if (listing.location.address) {
          locationValue = listing.location.address;
        } else {
          locationValue = JSON.stringify(listing.location);
        }
      }
      setFormData({
        title: listing.title || '',
        description: listing.description || '',
        location: locationValue,
        price: listing.price || '',
        type: listing.type || '',
      });
      setPhotoFile(null);
      if (listing.photo) {
        const photoPath = listing.photo.startsWith('/uploads/') ? listing.photo : `/uploads/${listing.photo}`;
        setPhotoPreview(listing.photo.startsWith('http') ? listing.photo : `http://localhost:5000${photoPath}`);
      } else if (listing.image) {
        const imagePath = listing.image.startsWith('/uploads/') ? listing.image : `/uploads/${listing.image}`;
        setPhotoPreview(listing.image.startsWith('http') ? listing.image : `http://localhost:5000${imagePath}`);
      } else if (listing.photos && listing.photos.length > 0) {
        const firstPhoto = listing.photos[0];
        const firstPhotoPath = firstPhoto.startsWith('/uploads/') ? firstPhoto : `/uploads/${firstPhoto}`;
        setPhotoPreview(firstPhoto.startsWith('http') ? firstPhoto : `http://localhost:5000${firstPhotoPath}`);
      } else {
        setPhotoPreview(null);
      }
    }
  }, [listing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
      setPhotoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('EditListingModal handleSubmit listing:', listing);
    if (!listing || !listing.id) {
      console.error('Cannot update: listing or listing.id is undefined');
      return;
    }
    onUpdate(formData, photoFile);
  };

  if (!listing) {
    return null;
  }

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="edit-listing-modal-title">
      <Box component="form" sx={style} onSubmit={handleSubmit} encType="multipart/form-data">
        <Typography id="edit-listing-modal-title" variant="h6" component="h2" mb={2}>
          Edit Listing
        </Typography>
        {photoPreview && (
          <Box mb={2} sx={{ textAlign: 'center' }}>
            <img src={photoPreview} alt="Current" style={{ maxWidth: '100%', maxHeight: 150, borderRadius: 4 }} />
          </Box>
        )}
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={3}
        />
        <TextField
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          helperText="Enter location as text (e.g., city or address)"
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          inputProps={{ min: 0 }}
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="type-label">Type</InputLabel>
          <Select
            labelId="type-label"
            name="type"
            value={formData.type}
            label="Type"
            onChange={handleChange}
          >
            <MenuItem value="room">Room</MenuItem>
            <MenuItem value="flat">Flat</MenuItem>
            <MenuItem value="pg">PG</MenuItem>
          </Select>
        </FormControl>
        <Box mt={2}>
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </Box>
        <Box mt={3} display="flex" justifyContent="flex-end" gap={2} flexShrink={0}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Update
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditListingModal;
