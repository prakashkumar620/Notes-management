const express = require('express');
const notesController = require('../controllers/notesController');
const { authMiddleware, roleBasedAccess } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Upload note (teachers and admins only)
router.post(
  '/upload',
  authMiddleware,
  roleBasedAccess('teacher', 'admin'),
  upload,
  handleUploadError,
  notesController.uploadNote
);

// Get all notes
router.get('/', authMiddleware, notesController.getAllNotes);

// Get single note
router.get('/:noteId', authMiddleware, notesController.getNote);

// Download note
router.get('/:noteId/download', authMiddleware, notesController.downloadNote);

// Delete note
router.delete('/:noteId', authMiddleware, notesController.deleteNote);

// Statistics (admin only)
router.get('/stats/all', authMiddleware, roleBasedAccess('admin'), notesController.getNoteStats);

module.exports = router;
