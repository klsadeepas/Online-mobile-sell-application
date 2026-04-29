const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Upload image
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, upload.array('images', 5), (req, res) => {
  if (req.files) {
    res.json(req.files.map(file => `/uploads/${file.filename}`));
  } else {
    res.status(400).json({ message: 'No image files uploaded' });
  }
});

module.exports = router;