const express = require('express');
const router = express.Router();
const Surveillance = require('../models/surveillanceModel');
const { protect } = require('../middleware/authMiddleware');

// Get all surveillance files
router.get('/', protect, async (req, res) => {
  try {
    const files = await Surveillance.find({ owner: req.user.id });
    res.json(files);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get single surveillance file
router.get('/:fileHash', protect, async (req, res) => {
  try {
    const file = await Surveillance.findOne({
      fileHash: req.params.fileHash,
      owner: req.user.id,
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json(file);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add new surveillance file
router.post('/', protect, async (req, res) => {
  try {
    const { fileHash, cloudinaryUrl, isPrivate } = req.body;

    const file = await Surveillance.create({
      fileHash,
      cloudinaryUrl,
      isPrivate,
      owner: req.user.id,
    });

    res.status(201).json(file);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete surveillance file
router.delete('/:fileHash', protect, async (req, res) => {
  try {
    const file = await Surveillance.findOne({
      fileHash: req.params.fileHash,
      owner: req.user.id,
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    await file.remove();
    res.json({ message: 'File removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 