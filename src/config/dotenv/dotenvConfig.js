require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT) || 3000,
  geminiKey: process.env.GEMINI_KEY,
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [],
  environment: process.env.ENVIRONMENT || 'development',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.ENVIRONMENT === 'production', // true em produção
    sameSite: process.env.ENVIRONMENT === 'production' ? 'None' : 'Lax',
  },
};
