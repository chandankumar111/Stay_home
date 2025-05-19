/**
 * JWT authentication and role-based authorization middleware
 */

const jwt = require('jsonwebtoken');

exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log('Authorization header:', authHeader);

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log('JWT verification error:', err);
        return res.status(403).json({ message: 'Invalid or expired token' });
      }
      console.log('JWT verified user:', user);
      req.user = user;
      next();
    });
  } else {
    console.log('Authorization token missing');
    res.status(401).json({ message: 'Authorization token missing' });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log('User role:', req.user.role, 'Allowed roles:', roles);
    if (!roles.includes(req.user.role)) {
      console.log('Access denied: insufficient permissions');
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};
