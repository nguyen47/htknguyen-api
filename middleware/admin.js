function admin(req, res, next) {
  if (!req.user.isAdmin === true) {
    return res.status(403).send("Access denied.");
  }
  next();
}

module.exports = admin;
