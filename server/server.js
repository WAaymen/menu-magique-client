const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// Import database and routes
const { initializeDatabase } = require('./database');
const menuItemsRoutes = require('./routes/menuItems');
const imagesRoutes = require('./routes/images');

// Read config file
const configPath = path.join(__dirname, 'config.env');
const configContent = fs.readFileSync(configPath, 'utf8');
const config = {};

configContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value && !key.startsWith('#')) {
    config[key.trim()] = value.trim();
  }
});

const app = express();
const PORT = config.PORT || 3001;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: ['http://192.168.1.16:8080', 'http://192.168.1.16:8082', 'http://localhost:8080', 'http://localhost:8082', 'http://127.0.0.1:8080', 'http://127.0.0.1:8082'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); // Enable CORS with specific origin
app.use(morgan('combined')); // Logging



// Increase payload limits for large images
app.use(express.json({ limit: '500mb' })); // Parse JSON bodies (very high limit)
app.use(express.urlencoded({ extended: true, limit: '500mb' })); // Parse URL-encoded bodies (very high limit)

// Add timeout settings for large uploads
app.use((req, res, next) => {
  req.setTimeout(300000); // 5 minutes timeout
  res.setTimeout(300000); // 5 minutes timeout
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV || 'development',
    database: {
      host: config.DB_HOST,
      port: config.DB_PORT,
      name: config.DB_NAME
    }
  });
});

// API Routes
app.use('/api/menu-items', menuItemsRoutes);
app.use('/api/images', imagesRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Menu Magique Restaurant Management API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      menuItems: '/api/menu-items',
      documentation: 'Available endpoints for menu management'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: 'Internal server error',
    message: error.message || 'Something went wrong on the server',
    ...(config.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log('🚀 Menu Magique Server started successfully!');
      console.log(`📍 Server running on port ${PORT}`);
      console.log(`🌐 API available at http://0.0.0.0:${PORT}`);
      console.log(`🔍 Health check: http://0.0.0.0:${PORT}/api/health`);
      console.log(`📊 Menu items API: http://0.0.0.0:${PORT}/api/menu-items`);
      console.log(`🌍 Accessible from any IP address on port ${PORT}`);
      console.log('✅ Ready to handle requests!');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();
