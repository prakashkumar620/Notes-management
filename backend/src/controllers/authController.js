const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Google OAuth Login
exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'ID Token is required' });
    }

    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Find or create user
    let user = await User.findOne({ email });

    // Define admin and teacher emails
    const adminEmail = process.env.ADMIN_EMAIL || 'ayush20042006@gmail.com';
    const teacherEmails = (process.env.TEACHER_EMAILS || 'prakashsaw2006@gmail.com').split(',').map(e => e.trim());

    // Determine user role based on email
    let userRole = 'student'; // Default role
    if (email === adminEmail) {
      userRole = 'admin';
    } else if (teacherEmails.includes(email)) {
      userRole = 'teacher';
    }

    if (!user) {
      user = new User({
        email,
        googleId,
        name,
        avatar: picture,
        role: userRole,
      });
      await user.save();
      console.log(`✓ New user created: ${email} (Role: ${userRole})`);
    } else {
      // Update last login and role (in case configuration changed)
      user.lastLogin = new Date();
      user.googleId = googleId;
      user.role = userRole; // Update role on every login based on email
      await user.save();
      console.log(`✓ User logged in: ${email} (Role: ${userRole})`);
    }

    // Generate JWT Token
    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Google Login Error:', error);
    res.status(401).json({
      message: 'Google login failed',
      error: error.message,
    });
  }
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching user',
      error: error.message,
    });
  }
};

// Get All Users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

// Update User Role (Admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    res.status(200).json({
      message: 'User role updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating user role',
      error: error.message,
    });
  }
};

// Logout (Frontend handles by removing token)
exports.logout = (req, res) => {
  res.status(200).json({
    message: 'Logout successful',
  });
};
