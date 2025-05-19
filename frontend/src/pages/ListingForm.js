import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const ListingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'pg',
    location: '',
    contactNumber: ''
  });
  const [newPhotos, setNewPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Autofill location with user's exact current address on mount if not editing
  useEffect(() => {
    if (!id) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const displayName = data.display_name || '';
            setFormData((prev) => ({
              ...prev,
              location: displayName
            }));
          } catch (error) {
            console.warn('Reverse geocoding error:', error);
          }
        }, (error) => {
          console.warn('Geolocation error:', error);
        });
      }
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      // Fetch property data to pre-fill form
      api.get(`/properties/${id}`)
        .then(response => {
          const property = response.data;
          setFormData({
            title: property.title || '',
            description: property.description || '',
            price: property.price || '',
            type: property.type || 'pg',
            location: property.location?.address || '',
            contactNumber: property.contactNumber || ''
          });
          setExistingPhotos(property.photos || []);
        })
        .catch(err => {
          setError('Failed to load property data');
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleNewPhotoChange = (e) => {
    setNewPhotos(e.target.files);
  };

  const handleRemoveExistingPhoto = (index) => {
    setExistingPhotos(existingPhotos.filter((_, i) => i !== index));
  };

  // Function to get coordinates from location name using OpenStreetMap Nominatim API
  const getCoordinates = async (locationName) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`);
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
    } else {
      throw new Error('Location not found');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Get coordinates for location name
      const { latitude, longitude, displayName } = await getCoordinates(formData.location);

      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('type', formData.type);
      data.append('contactNumber', formData.contactNumber);

      // Construct location as GeoJSON Point with address
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
        address: displayName
      };
      data.append('location', JSON.stringify(location));

      // Append existing photos as JSON string
      data.append('existingPhotos', JSON.stringify(existingPhotos));

      // Append new photos
      for (let i = 0; i < newPhotos.length; i++) {
        data.append('photos', newPhotos[i]);
      }

      if (isEditing) {
        await api.put(`/properties/${id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await api.post('/properties', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      // Redirect to dashboard after successful submission
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to save listing');
    }
  };

  return (
    <div className="container mt-4">
      <h2>{isEditing ? 'Edit Listing' : 'Create New Listing'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            className="form-control"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="type" className="form-label">Type</label>
          <select
            id="type"
            name="type"
            className="form-select"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="pg">PG</option>
            <option value="flat">Flat</option>
            <option value="room">Room</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            className="form-control"
            placeholder="Enter location (e.g., Delhi, Bhopal)"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="contactNumber" className="form-label">Contact Number</label>
          <input
            type="text"
            id="contactNumber"
            name="contactNumber"
            className="form-control"
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />
        </div>
        {isEditing && existingPhotos.length > 0 && (
          <div className="mb-3">
            <label className="form-label">Existing Photos</label>
            <div className="d-flex flex-wrap">
              {existingPhotos.map((photo, index) => (
                <div key={index} className="position-relative me-2 mb-2">
                  <img
                    src={photo.startsWith('http') ? photo : `/uploads/${photo}`}
                    alt={`Existing ${index + 1}`}
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                    onClick={() => handleRemoveExistingPhoto(index)}
                    style={{ zIndex: 1 }}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="photos" className="form-label">Add New Photos</label>
          <input
            type="file"
            id="photos"
            name="photos"
            className="form-control"
            multiple
            accept="image/*"
            onChange={handleNewPhotoChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">{isEditing ? 'Update' : 'Submit'}</button>
      </form>
    </div>
  );
};

export default ListingForm;
