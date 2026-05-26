const Note = require('../models/Note');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// Upload Note
exports.uploadNote = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, description, accessibleTo } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const note = new Note({
      title,
      description: description || '',
      uploadedBy: req.user.id,
      fileName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      accessibleTo: accessibleTo || 'all',
    });

    await note.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      note,
    });
  } catch (error) {
    // Delete file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      message: 'Error uploading file',
      error: error.message,
    });
  }
};

// Get All Notes (with access control)
exports.getAllNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = {};

    if (userRole === 'student') {
      // Students can only see notes accessible to all or themselves
      query = {
        $or: [
          { accessibleTo: 'all' },
          { uploadedBy: userId },
        ],
      };
    }

    const notes = await Note.find(query)
      .populate('uploadedBy', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: notes.length,
      notes,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching notes',
      error: error.message,
    });
  }
};

// Get Single Note
exports.getNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId).populate('uploadedBy', 'name email avatar');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check access
    if (
      note.accessibleTo === 'students' &&
      req.user.role === 'student' &&
      note.uploadedBy._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Increment view count
    note.views += 1;
    await note.save();

    res.status(200).json({
      note,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching note',
      error: error.message,
    });
  }
};

// Download Note
exports.downloadNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check access control
    if (note.accessibleTo === 'students' && req.user.role !== 'teacher') {
      // Only teachers can download 'students-only' notes
      if (note.uploadedBy.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const filePath = path.join(__dirname, '../../', note.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Increment download count
    note.downloads += 1;
    await note.save();

    res.download(filePath, note.fileName);
  } catch (error) {
    res.status(500).json({
      message: 'Error downloading note',
      error: error.message,
    });
  }
};

// Delete Note (only by uploader or admin)
exports.deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check authorization
    if (
      note.uploadedBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Unauthorized to delete this note' });
    }

    // Delete file from disk
    const filePath = path.join(__dirname, '../../', note.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Note.findByIdAndDelete(noteId);

    res.status(200).json({
      message: 'Note deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting note',
      error: error.message,
    });
  }
};

// Get Note Statistics (Admin only)
exports.getNoteStats = async (req, res) => {
  try {
    const totalNotes = await Note.countDocuments();
    const totalDownloads = await Note.aggregate([
      { $group: { _id: null, totalDownloads: { $sum: '$downloads' } } },
    ]);
    const totalViews = await Note.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } },
    ]);

    res.status(200).json({
      totalNotes,
      totalDownloads: totalDownloads[0]?.totalDownloads || 0,
      totalViews: totalViews[0]?.totalViews || 0,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};
