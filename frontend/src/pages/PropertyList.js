import React, { useEffect, useState } from 'react';
import api from '../api';

const API_BASE_URL = 'http://localhost:5000';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [normalizedUserRole, setNormalizedUserRole] = useState(null);

  useEffect(() => {
    // Get user id and role from token payload if available
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        setUserId(payload.id);
        setUserRole(payload.role);
        if (payload.role) {
          setNormalizedUserRole(payload.role.toLowerCase().trim());
        }
      } catch (e) {
        console.error('Failed to parse token payload', e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/properties', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Properties data:', response.data); // Log properties data for debugging
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return <div>Loading properties...</div>;
  }

  // Filter properties based on user role
  const filteredProperties = normalizedUserRole === 'owner'
    ? properties.filter(
        (property) =>
          userId &&
          property.owner &&
          (property.owner._id === userId || property.owner === userId)
      )
    : properties; // users see all properties

  return (
    <div>
      <h2>Available Properties</h2>
      {filteredProperties.length === 0 ? (
        <p>No properties available at the moment.</p>
      ) : (
        <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', padding: 0 }}>
          {filteredProperties.map((property) => {
            // Construct full image URL
            const imageUrl =
              property.photos && property.photos.length > 0
                ? `${API_BASE_URL}${property.photos[0]}`
                : 'https://images.unsplash.com/photo-1560184897-6a1a7a7a1a1a?auto=format&fit=crop&w=800&q=80';

            const handleDelete = async () => {
              if (!window.confirm('Are you sure you want to delete this property?')) return;
              try {
                await api.delete(`/properties/${property._id}`);
                setProperties((prev) => prev.filter((p) => p._id !== property._id));
              } catch (error) {
                console.error('Failed to delete property:', error);
                alert('Failed to delete property. Please try again.');
              }
            };

            return (
              <li
                key={property._id}
                style={{
                  listStyle: 'none',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  width: '220px',
                }}
              >
                <div style={{ width: '100%', height: '150px', overflow: 'hidden' }}>
                  <img
                    src={imageUrl}
                    alt={property.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-image.jpg';
                    }}
                  />
                </div>
                <div style={{ padding: '10px' }}>
                  <h3 style={{ margin: '0 0 10px 0' }}>{property.title}</h3>
                  <p style={{ margin: '0 0 5px 0' }}>{property.description}</p>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>Price: ₹{property.price}</p>
                  {property.owner && property.owner.name && (
                    <p style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>
                      Owner name: {property.owner.name}
                    </p>
                  )}
                  {console.log('Rendering buttons for userRole:', userRole, 'normalizedUserRole:', normalizedUserRole)}
                  {normalizedUserRole === 'owner' && (
                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => alert('Edit clicked')}
                        style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  {normalizedUserRole === 'user' && (
                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                      <button
                        style={{
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                        onClick={() => alert('Chat with Us clicked')}
                      >
                        Chat with Us
                      </button>
                      <button
                        style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                        onClick={() => alert('Book Now clicked')}
                      >
                        Book Now
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PropertyList;
