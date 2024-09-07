const express = require('express');
const { bisseccao } = require('./controllers/equacoes')

// O Router é usado para modularizar e organizar as rotas
const rotas = express.Router();

// Rotas para os metodos
rotas.post('/metodos', bisseccao );

module.exports = rotas;
