/**
 * Role-based access control middleware
 * Usage: roleMiddleware('admin') or roleMiddleware(['admin', 'staff'])
 */
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user exists (should be set by authMiddleware)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.'
        });
      }

      // Check if user's role is allowed
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. ${allowedRoles.join(' or ')} role required.`
        });
      }

      // User has required role, continue
      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization failed.',
        error: error.message
      });
    }
  };
};

module.exports = roleMiddleware;