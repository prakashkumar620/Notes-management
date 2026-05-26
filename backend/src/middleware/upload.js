const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if not exists
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  // Default allowed MIME types (including multiple variations)
  const defaultMimes = [
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
    'application/x-zip-compressed',
    'application/x-zip',
    'application/x-rar-compressed',
    'image/jpeg',
    'image/png',
  ];
  
  const allowedMimes = (process.env.ALLOWED_MIMETYPES ? process.env.ALLOWED_MIMETYPES.split(',').map(m => m.trim()) : defaultMimes);
  const finalAllowedMimes = [...new Set([...defaultMimes, ...allowedMimes])]; // Merge and deduplicate
  
  console.log(`📁 File upload attempt: ${file.originalname}`);
  console.log(`📋 MIME type: ${file.mimetype}`);
  console.log(`✓ Allowed types: ${finalAllowedMimes.join(', ')}`);
  
  // Check by MIME type
  if (finalAllowedMimes.includes(file.mimetype)) {
    console.log(`✅ File accepted: ${file.originalname}`);
    cb(null, true);
  } 
  // Fallback: Check by file extension for ZIP files (in case MIME type is not recognized)
  else if ((file.originalname.endsWith('.zip') || file.originalname.endsWith('.rar')) && 
           (file.mimetype.includes('zip') || file.mimetype.includes('rar') || file.mimetype === 'application/octet-stream')) {
    console.log(`✅ File accepted (by extension): ${file.originalname}`);
    cb(null, true);
  }
  else {
    const error = new Error(`File type "${file.mimetype}" not allowed. Please use: PDF, PPT, PPTX, ZIP, RAR, JPG, or PNG`);
    console.log(`❌ File rejected: ${file.originalname} (MIME: ${file.mimetype})`);
    cb(error, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || 314572800), // 300MB default
  },
});

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: `File size exceeds limit of ${process.env.MAX_FILE_SIZE || 314572800} bytes` 
      });
    }
    if (err.code === 'LIMIT_PART_COUNT') {
      return res.status(400).json({ message: 'Too many parts' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files' });
    }
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

module.exports = { upload: upload.single('file'), handleUploadError };
