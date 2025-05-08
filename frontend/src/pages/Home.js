import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    const fetchProperties = async () => {
      try {
        const response = await api.get('/properties');
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleDelete = async (propertyId) => {
    try {
      await api.delete(`/properties/${propertyId}`);
      setProperties(properties.filter(p => p._id !== propertyId));
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleEdit = (propertyId) => {
    navigate(`/edit-listing/${propertyId}`);
  };

  const handleBookNow = (property) => {
    if (user && user.role === 'user') {
      navigate(`/booking/${property._id}`);
    } else {
      alert(`Please log in first to book this ${property.type}`);
    }
  };

  if (loading) {
    return <p>Loading listings...</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Available Properties</h2>

      {properties.length === 0 ? (
        <p>No properties available.</p>
      ) : (
        <div className="row">
          {properties.map((property) => (
            <div key={property._id} className="col-md-4 mb-4">
              <div className="card h-100 d-flex flex-column">
                {property.photos && property.photos.length > 0 ? (
                  <img
                    src={property.photos[0].startsWith('http') ? property.photos[0] : `/uploads/${property.photos[0]}`}
                    className="card-img-top"
                    alt={property.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="card-img-top d-flex align-items-center justify-content-center bg-secondary text-white" style={{ height: '200px' }}>
                    No Image
                  </div>
                )}
                <div className="card-body d-flex flex-column flex-grow-1">
                  <h5 className="card-title">{property.title}</h5>
                  <p className="card-text">{property.description}</p>
                  <p className="card-text"><small className="text-muted">Location: {property.location?.address || 'N/A'}</small></p>
                  <p className="card-text"><strong>Price: </strong>${property.price}</p>
                  {user && user.role === 'owner' && (
                    <div className="mt-auto">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(property._id)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(property._id)}>Delete</button>
                    </div>
                  )}
                  {user && user.role === 'user' && (
                    <button className="btn btn-sm btn-success mt-auto" onClick={() => handleBookNow(property)}>Book Now</button>
                  )}
                  {!user && (
                    <button className="btn btn-sm btn-success mt-auto" onClick={() => handleBookNow(property)}>Book Now</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
