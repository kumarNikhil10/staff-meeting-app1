const jwt = require('jsonwebtoken');

// This function checks if user is logged in before letting them access certain routes
const protect = (req, res, next) => {
  // Get the token from request header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, access denied' });
  }

  try {
    // Verify the token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next(); // continue to the route
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

module.exports = { protect, adminOnly };
