/**
 * Main server file for PG/Flat Booking application
 */

const express = require('express');
const cors = require('cors');
const path = require('path');


// CORS configuration to allow all origins for testing
const corsOptions = {
  origin: '*', // Allow all origins temporarily for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false,
  optionsSuccessStatus: 200
};
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Use CORS middleware with updated options as first middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

const io = new Server(server, {
  cors: {
    origin: corsOptions.origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: corsOptions.credentials
  }
});

// Removed explicit OPTIONS handler middleware as cors handles it

/* Logging middleware to log incoming requests and headers for debugging
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  next();
});
*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve uploads folder as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set view engine
app.set('view engine', 'ejs');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/property'));
app.use('/api/bookings', require('./routes/booking'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/payments', require('./routes/payment'));

const socketHandler = require('./socketHandler');

// Socket.io chat handling
socketHandler(io);

// Default route
app.get('/', (req, res) => {
  res.render('index', { title: 'PG/Flat Booking Home' });
});

// Debug route to list files in uploads folder
const fs = require('fs');

app.get('/debug/uploads', (req, res) => {
  const uploadsDir = path.join(__dirname, 'uploads');
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error('Error reading uploads directory:', err);
      return res.status(500).json({ error: 'Failed to read uploads directory' });
    }
    res.json({ files });
  });
});

// Properties listing page
app.get('/properties', (req, res) => {
  res.render('properties', { title: 'Available Properties' });
});

// Booking page
app.get('/booking', (req, res) => {
  res.render('booking', { title: 'Book Property' });
});

// Owner dashboard
app.get('/owner/dashboard', (req, res) => {
  res.render('ownerDashboard', { title: 'Owner Dashboard' });
});

// Admin dashboard
app.get('/admin/dashboard', (req, res) => {
  res.render('adminDashboard', { title: 'Admin Dashboard' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
