module.exports = function checkComponentAccess(req, res, next) {
    const allowedRoles = ['project_manager', 'staff', 'operator'];
  
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient role permissions' });
    }
  
    next();
  };
  