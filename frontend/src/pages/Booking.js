import React, { useState } from 'react';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';

const Booking = () => {
  const { propertyId } = useParams();
  const [bookingDetails, setBookingDetails] = useState({
    startDate: '',
    endDate: '',
    guests: 1,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await api.post('/bookings', {
        propertyId,
        ...bookingDetails,
      });
      setSuccess('Booking successful! Proceed to payment.');
      // Optionally redirect to payment page
      navigate(`/payment/${response.data.bookingId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div>
      <h2>Book Property</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Start Date:</label><br />
          <input type="date" name="startDate" value={bookingDetails.startDate} onChange={handleChange} required />
        </div>
        <div>
          <label>End Date:</label><br />
          <input type="date" name="endDate" value={bookingDetails.endDate} onChange={handleChange} required />
        </div>
        <div>
          <label>Guests:</label><br />
          <input type="number" name="guests" min="1" value={bookingDetails.guests} onChange={handleChange} required />
        </div>
        <button type="submit">Book Now</button>
      </form>
    </div>
  );
};

export default Booking;
