const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Calculo Numerico',
            version: '1.0.0',
            description: 'Documentação da API',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local'
            },
            {
                url: 'https://api-calculonumerico.onrender.com',
                description: 'Servidor de Produção'
            }
        ],
    },
    apis: ['./docs/swagger.json'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;