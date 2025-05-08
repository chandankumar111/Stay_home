import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li><Link to="/" className="navbar-link">Home</Link></li>
        {!user && <li><Link to="/login" className="navbar-link">Login</Link></li>}
        {user && user.role === 'owner' && (
          <>
            <li><Link to="/listing" className="navbar-link">Listing</Link></li>
          </>
        )}
        {user && (
          <>
            <li>Welcome, {user.name}</li>
            <li><button onClick={handleLogout} className="navbar-logout-button">Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
