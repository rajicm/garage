const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const parkingRoutes = require('./routes/parking');

const app = express();

// Middleware
app.use(cors());              // Enable Cross-Origin Resource Sharing
app.use(express.json());       // Parse incoming JSON bodies

// Routes
app.use('/users', userRoutes);  // Route for user-related requests
app.use('/parking', parkingRoutes);  // Route for parking-related requests

app.get('/', (req, res) => {
  res.send('Welcome to the backend API');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
