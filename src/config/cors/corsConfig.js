const { allowedOrigins } = require('../dotenv/dotenvConfig');

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origin não permitida pelo CORS'));
    }
  },
  credentials: true, // Necessário para permitir o envio de cookies
};

module.exports = corsOptions;
