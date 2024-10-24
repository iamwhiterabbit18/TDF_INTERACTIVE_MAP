// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cardRoutes = require('./routes/cardRoutes'); // Import card routes
const modalRoutes = require('./routes/modalRoutes'); 
const audioRoutes = require('./routes/audioRoutes'); 
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const guestLogRoutes = require('./routes/guestLogRoutes');
const newsEventRoutes = require('./routes/newsEventRoutes');
dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); // Add this line to parse JSON requests
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
const dbUri = process.env.MONGO_URI;  // Name or change the Card&Audio if you create new DB in MongoDB
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


// All the routes used
app.use('/api/cards', cardRoutes);
app.use('/api/modal', modalRoutes); // Ensure this line exists
app.use('/api/audio', audioRoutes); // Ensure this line exists
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/guest', guestLogRoutes);
app.use('/api/images', newsEventRoutes);

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
