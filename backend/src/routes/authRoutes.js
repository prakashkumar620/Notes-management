const express = require('express');
const authController = require('../controllers/authController');
const { authMiddleware, roleBasedAccess } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/google-login', authController.googleLogin);
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', authMiddleware, authController.getCurrentUser);

// Admin routes
router.get('/users', authMiddleware, roleBasedAccess('admin'), authController.getAllUsers);
router.put('/users/:userId/role', authMiddleware, roleBasedAccess('admin'), authController.updateUserRole);

module.exports = router;
