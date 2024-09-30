const express = require('express');
const { bisseccao } = require('./controllers/bisseccaoController');
const { falsaPosicao } = require('./controllers/falsaPosicaoController');
const { newtonRaphson } = require('./controllers/newtonController');
const { secante } = require('./controllers/secanteController');
const { continuarSolucao } = require('./controllers/continuarSolucaoController');
const { perguntarIA } = require('./controllers/iaController');

const rotas = express.Router();

// Rotas para os métodos numéricos
rotas.post('/bisseccao', bisseccao);
rotas.post('/fp', falsaPosicao);
rotas.post('/newtonRaphson', newtonRaphson);
rotas.post('/secante', secante);

//Continua a solução com o método escolhido
rotas.post('/continuarSolucao', continuarSolucao);

// Rota para a IA
rotas.post('/perguntar', perguntarIA);

module.exports = rotas;
