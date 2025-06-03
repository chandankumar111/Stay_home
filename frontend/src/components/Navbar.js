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
      <div className="navbar-logo-container">
        <Link to="/" className="navbar-logo-link">
          <img src="/logo.png" alt="Stay_home Logo" className="navbar-logo-image" />
          <div className="navbar-logo-text"><strong>Stay_home</strong></div>
        </Link>
      </div>
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
            <li><Link to="/messages" className="navbar-link">Messages</Link></li>
            <li>Welcome, {user.name}</li>
            <li><button onClick={handleLogout} className="navbar-logout-button">Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
