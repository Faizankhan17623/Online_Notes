const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  tags: { type: [String], default: [] },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  subsectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subsection' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  direct: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
