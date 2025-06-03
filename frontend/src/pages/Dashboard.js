import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log('Logged in user:', storedUser);
    setUser(storedUser);

    const fetchProperties = async () => {
      try {
        const response = await api.get('/properties');
        console.log('Fetched properties:', response.data);
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

  if (!user) {
    return <p>Please login to view your dashboard.</p>;
  }

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className="container mt-4">
      <h2>{user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard</h2>

      {properties.length === 0 ? (
        <p>No properties available.</p>
      ) : (
        <div className="row">
          {properties.map((property) => {
            const userRole = user.role.toLowerCase();
            const userId = user.id || user._id;
            const propertyOwnerId = property.owner?._id ? property.owner._id : property.owner;

            console.log('User Role:', userRole);
            console.log('User ID:', userId);
            console.log('Property Owner ID:', propertyOwnerId);

            return (
              <div key={property._id} className="col-md-4 mb-4">
                <div className="card h-100">
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
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{property.title}</h5>
                    <p className="card-text">{property.description}</p>
                    <p className="card-text"><small className="text-muted">Location: {property.location?.address || 'N/A'}</small></p>
                    <p className="card-text"><strong>Price: </strong>${property.price}</p>
                    {userRole === 'user' && (
                      <div className="mt-auto">
                        <button className="btn btn-sm btn-outline-success me-2">Book Now</button>
                        <button className="btn btn-sm btn-outline-info">Chat with Owner</button>
                      </div>
                    )}
                    {userRole === 'owner' && userId === propertyOwnerId && (
                      <div className="mt-auto">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(property._id)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(property._id)}>Delete</button>
                      </div>
                    )}
                    {userRole === 'admin' && (
                      <div className="mt-auto">
                        <button className="btn btn-sm btn-outline-danger me-2" onClick={() => handleDelete(property._id)}>Delete Any Listing</button>
                        {/* Add more admin controls here */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
