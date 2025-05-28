const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Add a proxy endpoint for localhost:3000
app.get('/api/proxy', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Attempt to make a request to localhost:3000
  const proxyReq = http.request({
    host: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET',
    timeout: 5000  // 5 second timeout
  }, (proxyRes) => {
    res.statusCode = proxyRes.statusCode;
    
    let responseData = '';
    proxyRes.on('data', (chunk) => {
      responseData += chunk;
    });
    
    proxyRes.on('end', () => {
      res.end(JSON.stringify({
        success: true,
        statusCode: proxyRes.statusCode,
        statusMessage: proxyRes.statusMessage,
        data: responseData
      }));
    });
  });
  
  proxyReq.on('error', (e) => {
    res.statusCode = 502;
    res.end(JSON.stringify({
      success: false,
      error: e.message,
      details: "The server could not connect to localhost:3000. This is expected behavior when deployed to render.com."
    }));
  });
  
  proxyReq.on('timeout', () => {
    proxyReq.destroy();
    res.statusCode = 504;
    res.end(JSON.stringify({
      success: false,
      error: "Timeout",
      details: "The request to localhost:3000 timed out after 5 seconds."
    }));
  });
  
  proxyReq.end();
});

// Route all other requests to the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
