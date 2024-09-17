require('dotenv').config();

module.exports = {
    port: Number(process.env.PORT) || 3000,  // Converte a variável de ambiente para número e define um padrão
    geminiKey: process.env.GEMINI_KEY        // Usando a variável de ambiente correta
};
