const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await User.create({ email, password });
    
    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({ message: 'Error signing up', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'User does not exist' });
    }

    if (user && (await user.comparePassword(password))) {
      const token = generateToken(user._id);

      res.json({
        user: {
          id: user._id,
          email: user.email,
        },
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error logging in', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  const user = await User.findById(req.user.id);

  res.json({
    id: user._id,
    email: user.email,
  });
};

module.exports = {
  signup,
  login,
  getMe,
};