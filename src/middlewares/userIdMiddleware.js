const { v4: uuidv4 } = require('uuid');

const userIdMiddleware = (req, res, next) => {
  if (!req.cookies.userId) {
    const userId = uuidv4();
    res.cookie('userId', userId, { maxAge: 3600000, httpOnly: true });
    req.cookies.userId = userId;
  }
  next();
};

module.exports = userIdMiddleware;