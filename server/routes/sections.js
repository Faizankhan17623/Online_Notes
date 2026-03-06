const express = require('express');
const Section = require('../models/Section');
const Subsection = require('../models/Subsection');
const Bookmark = require('../models/Bookmark');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

// GET /api/sections — all sections with subsection + bookmark counts
router.get('/', async (req, res) => {
  try {
    const sections = await Section.find({ userId: req.user._id }).sort({ createdAt: -1 });

    const sectionsWithCounts = await Promise.all(
      sections.map(async (s) => {
        const subsectionCount = await Subsection.countDocuments({ sectionId: s._id });
        const bookmarkCount = await Bookmark.countDocuments({ sectionId: s._id });
        return { ...s.toObject(), subsectionCount, bookmarkCount };
      })
    );

    res.json({ success: true, data: sectionsWithCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/sections
router.post('/', async (req, res) => {
  try {
    const { name, description, color } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

    const section = await Section.create({ name, description, color: color || '#4f46e5', userId: req.user._id });
    res.status(201).json({ success: true, data: { ...section.toObject(), subsectionCount: 0, bookmarkCount: 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/sections/:id
router.put('/:id', async (req, res) => {
  try {
    const section = await Section.findOne({ _id: req.params.id, userId: req.user._id });
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });

    const { name, description, color } = req.body;
    section.name = name ?? section.name;
    section.description = description ?? section.description;
    section.color = color ?? section.color;

    const updated = await section.save();
    const subsectionCount = await Subsection.countDocuments({ sectionId: updated._id });
    const bookmarkCount = await Bookmark.countDocuments({ sectionId: updated._id });
    res.json({ success: true, data: { ...updated.toObject(), subsectionCount, bookmarkCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/sections/:id — also deletes all subsections + bookmarks inside
router.delete('/:id', async (req, res) => {
  try {
    const section = await Section.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });

    await Subsection.deleteMany({ sectionId: req.params.id });
    await Bookmark.deleteMany({ sectionId: req.params.id });

    res.json({ success: true, message: 'Section and all its content deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
