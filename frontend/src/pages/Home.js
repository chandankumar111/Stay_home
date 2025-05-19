import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import FilterNavbar from '../components/FilterNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ id: 'owner123', role: 'owner' }); // Simulated logged-in user with role
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    priceRange: [0, 10000],
    propertyType: '',
  });
  const [appliedFilters, setAppliedFilters] = useState({
    location: '',
    priceRange: [0, 10000],
    propertyType: '',
  });

  // Fetch user location on mount and update filters.location with location name
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const locationName = data.address.city || data.address.town || data.address.village || data.address.county || '';
            setFilters((prevFilters) => ({
              ...prevFilters,
              location: locationName,
            }));
          } catch (error) {
            console.warn('Reverse geocoding error:', error);
            const coordString = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
            setFilters((prevFilters) => ({
              ...prevFilters,
              location: coordString,
            }));
          }
        },
        (error) => {
          console.warn('Geolocation error:', error);
        }
      );
    }
  }, []);

  const onFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const onApplyFilters = useCallback((filterValues) => {
    setAppliedFilters(filterValues);
  }, []);

  const fetchProperties = useCallback(async () => {
    const noFiltersApplied =
      !appliedFilters.location &&
      (!appliedFilters.priceRange || (appliedFilters.priceRange[0] === 0 && appliedFilters.priceRange[1] === 10000)) &&
      !appliedFilters.propertyType;

    setLoading(true);
    try {
      const params = noFiltersApplied
        ? {}
        : {
            location: appliedFilters.location,
            minPrice: appliedFilters.priceRange ? appliedFilters.priceRange[0] : undefined,
            maxPrice: appliedFilters.priceRange ? appliedFilters.priceRange[1] : undefined,
            type: appliedFilters.propertyType,
          };
      const response = await api.get('/properties', { params });
      if (response.data && response.data.length > 0) {
        setProperties(response.data);
      } else {
        setProperties([]);
        if (!noFiltersApplied) {
          console.warn('No properties found for filters:', appliedFilters);
        }
      }
    } catch (error) {
      console.error('Failed to fetch properties', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const onClearFilters = useCallback(() => {
    const defaultFilters = {
      location: '',
      priceRange: [0, 10000],
      propertyType: '',
    };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  }, []);

  const handleEditClick = (listing) => {
    navigate(`/edit-listing/${listing.id || listing._id}`);
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.delete(`/properties/${listingId}`);
      setProperties((prev) => prev.filter((item) => item.id !== listingId));
    } catch (error) {
      console.error('Failed to delete listing', error);
    }
  };

  return (
    <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: 0, paddingRight: 0 }}>
      <FilterNavbar
        filters={filters}
        onFilterChange={onFilterChange}
        onSearchClick={onApplyFilters}
        onClearClick={onClearFilters}
      />
      {loading ? (
        <p>Loading properties...</p>
      ) : properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <div className="row mt-filter-cards">
          {properties.map((property) => {
            const isOwner = user && user.role === 'owner';
            return (
              <div key={property.id || property._id || Math.random()} className="col-md-4 mb-4" style={{ padding: '10px' }}>
                <div className="card h-100 shadow-sm">
                  <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                    {property.photo || property.image || (property.photos && property.photos.length > 0) ? (
                      <img
                        src={
                          (() => {
                            const photoUrl =
                              property.photo ||
                              property.image ||
                              (property.photos && property.photos.length > 0 && property.photos[0]);
                            if (!photoUrl) return '';
                            if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
                              return photoUrl;
                            }
                            const backendBaseUrl = 'http://localhost:5000';
                            if (photoUrl.startsWith('/')) {
                              return backendBaseUrl + photoUrl;
                            }
                            return backendBaseUrl + '/uploads/' + photoUrl;
                          })()
                        }
                        className="card-img-top"
                        alt={property.name || 'Property photo'}
                        style={{ width: '100%', height: '100%', objectFit: 'fill' }}
                      />
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center bg-light"
                        style={{ height: '200px', borderRadius: '0.25rem' }}
                      >
                        <span className="text-muted">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{property.title || property.name}</h5>
                    {property.description && (
                      <p className="card-text text-muted" style={{ flexGrow: 1 }}>
                        {property.description}
                      </p>
                    )}
                    <ul className="list-group list-group-flush mb-3">
                      <li className="list-group-item">
                        <strong>Location:</strong>{' '}
                        {property.location
                          ? typeof property.location === 'string'
                            ? property.location
                            : property.location.address
                            ? property.location.address
                            : JSON.stringify(property.location)
                          : 'N/A'}
                      </li>
                      <li className="list-group-item">
                        <strong>Price:</strong> ₹
                        {property.price !== undefined && property.price !== null ? property.price : 'N/A'}
                      </li>
                      <li className="list-group-item">
                        <strong>Type:</strong>{' '}
                        {property.type && typeof property.type === 'string' ? property.type : 'N/A'}
                      </li>
                    </ul>
                    {isOwner && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button className="btn btn-primary" onClick={() => handleEditClick(property)}>
                          Edit
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDeleteListing(property.id)}>
                          Delete
                        </button>
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

export default Home;
