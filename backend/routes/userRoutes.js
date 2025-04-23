const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const { protect } = require('../middleware/authMiddleware');

// Test route
router.get('/test', (req, res) => {
  console.log('User routes test endpoint hit');
  res.json({ message: 'User routes working' });
});

// Register user
router.post('/register', async (req, res) => {
  console.log('\n=== Registration Request Started ===');
  console.log('Time:', new Date().toISOString());
  
  try {
    // Log raw request
    console.log('Raw request body:', req.body);
    
    // Validate request body exists
    if (!req.body) {
      console.log('Error: No request body received');
      return res.status(400).json({ message: 'No request body received' });
    }

    const { name, email, password } = req.body;

    // Validate all required fields
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');

    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user exists
    console.log('Checking if user exists with email:', email);
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    console.log('Creating new user with name:', name, 'and email:', email);
    const user = await User.create({
      name,
      email,
      password,
    });

    if (!user) {
      console.log('Failed to create user - database operation failed');
      return res.status(500).json({ message: 'Failed to create user' });
    }

    console.log('User created successfully:', {
      id: user._id,
      name: user.name,
      email: user.email
    });

    // Generate token
    const token = generateToken(user._id);
    console.log('Generated authentication token');

    // Send response
    const response = {
      _id: user.id,
      name: user.name,
      email: user.email,
      token
    };

    console.log('Sending success response');
    res.status(201).json(response);
    
  } catch (error) {
    console.error('\n=== Registration Error ===');
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Send appropriate error response
    if (error.name === 'ValidationError') {
      res.status(400).json({
        message: 'Validation error',
        details: error.message
      });
    } else if (error.code === 11000) {
      res.status(400).json({
        message: 'Duplicate email address'
      });
    } else {
      res.status(500).json({
        message: 'Server error during registration',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  } finally {
    console.log('=== Registration Request Ended ===\n');
  }
});

// Login user
router.post('/login', async (req, res) => {
  console.log('\n--- Login Request Started ---');
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      console.log('Login successful for user:', user._id);
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      console.log('Invalid login attempt for email:', email);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: error.message });
  }
  console.log('--- Login Request Completed ---\n');
});

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = router; 