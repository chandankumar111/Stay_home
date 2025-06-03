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
import Messages from './pages/Messages';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/" element={<PropertyList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/listing"
              element={
                <PrivateRoute allowedRoles={['owner']}>
                  <ListingForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-listing/:id"
              element={
                <PrivateRoute allowedRoles={['owner']}>
                  <ListingForm />
                </PrivateRoute>
              }
            />
            {/* Other routes can be added here */}
            <Route path="/properties" element={<PropertyList />} />
            <Route
              path="/booking/:propertyId"
              element={
                <PrivateRoute>
                  <Booking />
                </PrivateRoute>
              }
            />
            <Route
              path="/payment/:bookingId"
              element={
                <PrivateRoute>
                  <Payment />
                </PrivateRoute>
              }
            />
            <Route
              path="/chat/:propertyId"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <PrivateRoute>
                  <Messages />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
