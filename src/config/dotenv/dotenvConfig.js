require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT) || 3000,
  geminiKey: process.env.GEMINI_KEY,
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [],
  environment: process.env.ENVIRONMENT || 'development',
  cookieOptions: {
    httpOnly: process.env.COOKIE_HTTPONLY === 'true', // Converte para booleano
    secure: process.env.COOKIE_SECURE === 'true', // Converte para booleano
    sameSite: process.env.COOKIE_SAMESITE || 'Lax', // Usa a configuração de SameSite
  },
};
