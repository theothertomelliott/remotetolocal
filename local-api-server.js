const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Configure CORS
app.use(cors({
  // Allow requests from https://remotetolocal.onrender.com
  origin: 'https://remotetolocal.onrender.com',
  // Allow these HTTP methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // Allow these headers in requests
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  // Allow credentials (cookies, authorization headers, etc.)
  credentials: true
}));

// Create a simple API endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Hello from localhost:3000!',
    timestamp: new Date().toISOString(),
    cors: 'Enabled for https://remotetolocal.onrender.com'
  });
});

// Add some example data endpoints
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    server: 'localhost:3000',
    environment: 'development'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
});
