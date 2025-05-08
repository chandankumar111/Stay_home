import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PropertyList from './pages/PropertyList';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import Chat from './pages/Chat';
import ListingForm from './pages/ListingForm';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/listing" element={<ListingForm />} />
            <Route path="/edit-listing/:id" element={<ListingForm />} />
            {/* Other routes can be added here */}
            <Route path="/properties" element={<PropertyList />} />
            <Route path="/booking/:propertyId" element={<Booking />} />
            <Route path="/payment/:bookingId" element={<Payment />} />
            <Route path="/chat/:propertyId" element={<Chat />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
