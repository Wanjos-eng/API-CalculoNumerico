const express = require('express');
const { bisseccao } = require('./controllers/biseccaoController');
const  {falsaPosicao}  = require('./controllers/falsaPosicaoController')

// O Router é usado para modularizar e organizar as rotas
const rotas = express.Router();

// Rotas para os metodos
rotas.post('/bisseccao', bisseccao );
rotas.post('/fp', falsaPosicao)

module.exports = rotas;
