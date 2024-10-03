const { v4: uuidv4 } = require('uuid');
const { cookieOptions } = require('../config/dotenv/dotenvConfig');

const userIdMiddleware = (req, res, next) => {
  if (!req.cookies.userId) {
    const userId = uuidv4();

    res.cookie('userId', userId, {
      ...cookieOptions,
      maxAge: 3600000, // 1 hora
    });

    req.cookies.userId = userId;
  }
  next();
};

module.exports = userIdMiddleware;

