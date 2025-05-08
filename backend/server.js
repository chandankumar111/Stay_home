/**
 * Main server file for PG/Flat Booking application
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

// CORS configuration to allow specific origin and credentials
const corsOptions = {
  origin: 'http://localhost:3000', // React frontend default port
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
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
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// Explicitly handle OPTIONS requests to respond with 204 No Content
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log('Received OPTIONS request for:', req.originalUrl);
    res.sendStatus(204);
  } else {
    next();
  }
});

// Logging middleware to log incoming requests and headers for debugging
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  next();
});

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

// Socket.io chat handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('chatMessage', ({ roomId, senderId, message }) => {
    io.to(roomId).emit('chatMessage', { senderId, message, timestamp: new Date() });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Default route
app.get('/', (req, res) => {
  res.render('index', { title: 'PG/Flat Booking Home' });
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

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
