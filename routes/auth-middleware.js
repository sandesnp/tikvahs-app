function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    //jumps to next middleware
    return next();
  }
  return res.status(500).json({ message: 'You are not authorized yet.' });
}

function checkNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    //jumps to next middleware
    return next();
  }
  return res.status(404).json({ error: 'You are already logged in.' });
}

function checkAdmin(req, res, next) {
  // First, ensure the user is authenticated
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'You are not authenticated.' });
  }

  // Check if the logged-in user is the admin
  if (req.user.userType === 'admin' || req.user.userType === 'super') {
    return next(); // The user is an admin, proceed to the next middleware
  }

  // If the user is not the admin, return a response indicating they are unauthorized
  return res
    .status(403)
    .json({ message: 'You are not authorized to access this resource.' });
}

module.exports = { checkAuthenticated, checkNotAuthenticated, checkAdmin };
