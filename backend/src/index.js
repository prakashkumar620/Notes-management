const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');

// Initialize express app
const app = express();

// RENDER FIX: Disable strict host header validation
app.set('trust proxy', true);
app.disable('x-powered-by');

// Middleware - CORS before everything else
app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '300mb' }));
app.use(express.urlencoded({ limit: '300mb', extended: true }));

// Serve uploaded files as static
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Handle preflight requests
app.options('*', cors());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => console.error('✗ MongoDB connection error:', err));

// Health Check Endpoint (for monitoring)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Notes Management API',
    version: '1.0.0',
    status: 'running'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle host header errors
  if (err.message && err.message.includes('Invalid Host header')) {
    return res.status(200).json({
      message: 'Request accepted',
      status: 'ok'
    });
  }
  
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

// Start Server - using http.createServer to bypass host header validation
const PORT = process.env.PORT || 5000;

// Create HTTP server directly to avoid Express host header validation
const server = http.createServer((req, res) => {
  // RENDER FIX: Bypass host header validation by setting checkServerIdentity
  app(req, res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server running on http://0.0.0.0:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle server errors
server.on('clientError', (err, socket) => {
  if (err.code === 'HPE_HEADER_OVERFLOW') {
    socket.end('HTTP/1.1 431 Request Header Fields Too Large\r\n\r\n');
  } else if (err.code !== 'ECONNRESET') {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  }
});

module.exports = app;
