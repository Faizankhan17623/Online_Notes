const express = require('express');
const Bookmark = require('../models/Bookmark');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

// GET /api/bookmarks?subsectionId=xxx&search=xxx
router.get('/', async (req, res) => {
  try {
    const { subsectionId, search } = req.query;
    if (!subsectionId) return res.status(400).json({ success: false, message: 'subsectionId is required' });

    const query = { subsectionId, userId: req.user._id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const bookmarks = await Bookmark.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: bookmarks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/bookmarks
router.post('/', async (req, res) => {
  try {
    const { title, url, description, tags, sectionId, subsectionId } = req.body;
    if (!title || !url || !sectionId || !subsectionId)
      return res.status(400).json({ success: false, message: 'title, url, sectionId and subsectionId are required' });

    const bookmark = await Bookmark.create({
      title, url, description, tags: tags || [],
      sectionId, subsectionId, userId: req.user._id,
    });
    res.status(201).json({ success: true, data: bookmark });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/bookmarks/:id
router.put('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({ _id: req.params.id, userId: req.user._id });
    if (!bookmark) return res.status(404).json({ success: false, message: 'Bookmark not found' });

    const { title, url, description, tags } = req.body;
    bookmark.title = title ?? bookmark.title;
    bookmark.url = url ?? bookmark.url;
    bookmark.description = description ?? bookmark.description;
    bookmark.tags = tags ?? bookmark.tags;

    const updated = await bookmark.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/bookmarks/:id
router.delete('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!bookmark) return res.status(404).json({ success: false, message: 'Bookmark not found' });
    res.json({ success: true, message: 'Bookmark deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
