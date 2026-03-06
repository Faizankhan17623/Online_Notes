const express = require('express');
const Subsection = require('../models/Subsection');
const Bookmark = require('../models/Bookmark');
const Section = require('../models/Section');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

// GET /api/subsections?sectionId=xxx
router.get('/', async (req, res) => {
  try {
    const { sectionId } = req.query;
    if (!sectionId) return res.status(400).json({ success: false, message: 'sectionId is required' });

    const subsections = await Subsection.find({ sectionId, userId: req.user._id }).sort({ createdAt: -1 });

    const withCounts = await Promise.all(
      subsections.map(async (sub) => {
        const bookmarkCount = await Bookmark.countDocuments({ subsectionId: sub._id });
        return { ...sub.toObject(), bookmarkCount };
      })
    );

    res.json({ success: true, data: withCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/subsections
router.post('/', async (req, res) => {
  try {
    const { name, sectionId } = req.body;
    if (!name || !sectionId) return res.status(400).json({ success: false, message: 'name and sectionId are required' });

    const section = await Section.findOne({ _id: sectionId, userId: req.user._id });
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });

    const subsection = await Subsection.create({ name, sectionId, userId: req.user._id });
    res.status(201).json({ success: true, data: { ...subsection.toObject(), bookmarkCount: 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/subsections/:id
router.put('/:id', async (req, res) => {
  try {
    const sub = await Subsection.findOne({ _id: req.params.id, userId: req.user._id });
    if (!sub) return res.status(404).json({ success: false, message: 'Subsection not found' });

    sub.name = req.body.name ?? sub.name;
    const updated = await sub.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/subsections/:id — also deletes all bookmarks inside
router.delete('/:id', async (req, res) => {
  try {
    const sub = await Subsection.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!sub) return res.status(404).json({ success: false, message: 'Subsection not found' });

    await Bookmark.deleteMany({ subsectionId: req.params.id });
    res.json({ success: true, message: 'Subsection and its bookmarks deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
