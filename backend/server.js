const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Detailed request logging
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`\n=== New Request ===`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Headers:`, req.headers);
  
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', {
      ...req.body,
      password: req.body.password ? '[HIDDEN]' : undefined
    });
  }

  // Log response
  const oldSend = res.send;
  res.send = function(data) {
    console.log(`\nResponse sent in ${Date.now() - start}ms:`);
    console.log('Status:', res.statusCode);
    console.log('Response:', typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    console.log('=== Request End ===\n');
    oldSend.apply(res, arguments);
  };

  next();
});

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Test route
app.get('/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Backend is running!' });
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/surveillance', require('./routes/surveillanceRoutes'));
app.use('/api/blockchain', require('./routes/blockchainRoutes'));

// Basic route for testing
app.get('/', (req, res) => {
  console.log('Root endpoint hit');
  res.json({ message: 'Welcome to BICAS API' });
});

// Error handler with logging
app.use((err, req, res, next) => {
  console.error('\n=== Error Occurred ===');
  console.error('Time:', new Date().toISOString());
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.error('=== Error End ===\n');
  
  res.status(err.status || 500).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 3001;

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`
    🚀 Server is running on port ${PORT}
    📁 API endpoint: http://localhost:${PORT}/api
    🔍 Test endpoint: http://localhost:${PORT}/test
    
    Environment: ${process.env.NODE_ENV}
    MongoDB URI: ${process.env.MONGODB_URI}
    CORS Origin: ${corsOptions.origin}
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('\n=== Unhandled Rejection ===');
  console.error('Time:', new Date().toISOString());
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.error('=== Error End ===\n');
  
  // Close server & exit process
  server.close(() => process.exit(1));
}); 