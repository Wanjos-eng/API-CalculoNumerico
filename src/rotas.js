const express = require('express');
const { bisseccao } = require('./controllers/bisseccaoController');
const { falsaPosicao } = require('./controllers/falsaPosicaoController');
const { newtonRaphson } = require('./controllers/newtonController');
const { secante } = require('./controllers/secanteController');
const { perguntarIA } = require('./controllers/iaController');

const rotas = express.Router();

// Rotas para os métodos numéricos
rotas.post('/bisseccao', bisseccao);
rotas.post('/fp', falsaPosicao);
rotas.post('/newtonRaphson', newtonRaphson);
rotas.post('/secante', secante);

// Rota para a IA
rotas.post('/perguntar', perguntarIA);

module.exports = rotas;
