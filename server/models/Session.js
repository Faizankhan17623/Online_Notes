const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token:      { type: String, required: true, unique: true },
  deviceInfo: { type: String, default: 'Unknown device' },
  ipAddress:  { type: String, default: 'Unknown' },
  lastUsedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
