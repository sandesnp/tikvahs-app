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

module.exports = { checkAuthenticated, checkNotAuthenticated };
