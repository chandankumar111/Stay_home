import React, { useEffect, useState } from 'react';
import api from '../api';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (loading) {
    return <div>Loading properties...</div>;
  }

  return (
    <div>
      <h2>Available Properties</h2>
      {properties.length === 0 ? (
        <p>No properties available at the moment.</p>
      ) : (
        <ul>
          {properties.map((property) => (
            <li key={property._id}>
              <h3>{property.title}</h3>
              <p>{property.description}</p>
              <p>Price: ₹{property.price}</p>
              {/* Add booking button and details */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PropertyList;
