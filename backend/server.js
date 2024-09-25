// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const serveIndex = require('serve-index');


const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for the frontend

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Directory listing for development purposes (remove in production)
app.use('/uploads', serveIndex(path.join(__dirname, 'uploads')));

app.use(bodyParser.json()); // Parse JSON data in request body
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/Card&Audio'; // Name or change the Card&Audio if you create new DB in MongoDB
mongoose.connect(dbUri);

// Database connection events
mongoose.connection.on('connected', () => {
  console.log('Successfully connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

// Import routes
const cardRoutes = require('./routes/cardRoutes');
const modalRoutes = require('./routes/modalRoutes'); // Import modal routes
const audioRoutes = require('./routes/audioRoutes');

// Use routes
app.use('/card', cardRoutes); // All routes related to 'card' are now handled here
app.use('/modal', modalRoutes); // All routes related to 'modal' are handled here
app.use('/api/audio', audioRoutes);// All routes related to 'audio' are handled here

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
