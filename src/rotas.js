const express = require('express');
const { bisseccao } = require('./controllers/biseccaoController');
const  { falsaPosicao }  = require('./controllers/falsaPosicaoController');
const  { newtonRaphson }  = require('./controllers/newtonController');
const { secante } = require('./controllers/secanteController');

// O Router é usado para modularizar e organizar as rotas
const rotas = express.Router();

// Rotas para os metodos
rotas.post('/bisseccao', bisseccao);
rotas.post('/fp', falsaPosicao);
rotas.post('/newtonRaphson', newtonRaphson);
rotas.post('/secante', secante);

module.exports = rotas;