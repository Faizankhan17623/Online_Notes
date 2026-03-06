const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 1. Verify JWT signature + expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Check the session still exists in DB
    //    (deleted on logout or if admin removes it)
    const session = await Session.findOne({ token });
    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.',
      });
    }

    // 3. Check the user still exists
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    // 4. Keep lastUsedAt fresh (fire-and-forget, don't block the request)
    Session.findByIdAndUpdate(session._id, { lastUsedAt: new Date() }).catch(() => {});

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
