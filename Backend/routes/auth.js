const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Input validation middleware
const validateAuthInput = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  if (password.trim().length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  
  next();
};

// Registration input validation middleware
const validateRegisterInput = (req, res, next) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email and password are required' });
  }
  
  if (username.trim().length < 3 || username.trim().length > 20) {
    return res.status(400).json({ message: 'Username must be between 3-20 characters' });
  }
  
  if (password.trim().length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  
  next();
};

// Check username availability
router.get('/check-username/:username', async (req, res) => {
  try {
    const username = req.params.username.trim();
    const user = await User.findOne({ username });
    res.json({ available: !user });
  } catch (err) {
    console.error('Username check error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Signup Route - Updated with username
router.post('/signup', validateRegisterInput, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const cleanUsername = username.trim();
    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim();
    
    // Check if user exists (email or username)
    const existingUser = await User.findOne({ 
      $or: [
        { email: cleanEmail },
        { username: cleanUsername }
      ]
    });
    
    if (existingUser) {
      if (existingUser.email === cleanEmail) {
        return res.status(409).json({ message: 'Email already in use' });
      } else {
        return res.status(409).json({ message: 'Username already taken' });
      }
    }
    
    // Create new user (password will be hashed in pre-save hook)
    const user = new User({ 
      username: cleanUsername,
      email: cleanEmail,
      password: cleanPassword
    });
    
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(201).json({ 
      success: true,
      token, 
      userId: user._id,
      username: user.username,
      email: user.email
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Registration failed' 
    });
  }
});

// Login Route - Updated (remains email-based)
router.post('/login', validateAuthInput, async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim();
    
    // Find user with password
    const user = await User.findOne({ email: cleanEmail }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Compare passwords
    const isMatch = await bcrypt.compare(cleanPassword, user.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      token,
      userId: user._id,
      username: user.username,  // Now includes username in response
      email: user.email
    });
    
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;