const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const MAX_DEVICES = 2;

/* ── Helpers ── */

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

function getIP(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'Unknown'
  );
}

function parseDevice(ua = '') {
  const s = ua.toLowerCase();

  let os = 'Unknown OS';
  if (s.includes('android'))              os = 'Android';
  else if (s.includes('iphone'))          os = 'iPhone';
  else if (s.includes('ipad'))            os = 'iPad';
  else if (s.includes('windows'))         os = 'Windows';
  else if (s.includes('mac os'))          os = 'macOS';
  else if (s.includes('linux'))           os = 'Linux';

  let browser = 'Unknown Browser';
  if      (s.includes('edg'))                          browser = 'Edge';
  else if (s.includes('chrome') && !s.includes('edg')) browser = 'Chrome';
  else if (s.includes('firefox'))                      browser = 'Firefox';
  else if (s.includes('safari') && !s.includes('chrome')) browser = 'Safari';
  else if (s.includes('opera') || s.includes('opr'))   browser = 'Opera';

  return `${browser} on ${os}`;
}

/* ── POST /api/auth/register ── */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ success: false, message: 'User already exists' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    await Session.create({
      userId:     user._id,
      token,
      deviceInfo: parseDevice(req.headers['user-agent']),
      ipAddress:  getIP(req),
    });

    res.status(201).json({
      success: true,
      data: { _id: user._id, name: user.name, email: user.email, token },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ── POST /api/auth/login ── */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    // Check active session count
    const sessionCount = await Session.countDocuments({ userId: user._id });
    if (sessionCount >= MAX_DEVICES) {
      return res.status(403).json({
        success: false,
        message: `This account is already logged in on ${MAX_DEVICES} devices. Please log out from another device first.`,
      });
    }

    const token = generateToken(user._id);

    await Session.create({
      userId:     user._id,
      token,
      deviceInfo: parseDevice(req.headers['user-agent']),
      ipAddress:  getIP(req),
    });

    res.json({
      success: true,
      data: { _id: user._id, name: user.name, email: user.email, token },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ── POST /api/auth/logout ── */
router.post('/logout', protect, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    await Session.findOneAndDelete({ token });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ── GET /api/auth/sessions ── (see active sessions for current user) */
router.get('/sessions', protect, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user._id })
      .select('-token')
      .sort({ lastUsedAt: -1 });
    res.json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
