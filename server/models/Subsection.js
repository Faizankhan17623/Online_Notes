const mongoose = require('mongoose');

const subsectionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Subsection', subsectionSchema);
