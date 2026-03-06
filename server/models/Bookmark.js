const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  tags: { type: [String], default: [] },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  subsectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subsection', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
