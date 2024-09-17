// index.js
const { port } = require('./config/dotenv/dotenvConfig');
const express = require('express');
const rotas = require('./rotas');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger/docs/swagger.json');
const cookieParser = require('cookie-parser');
const userIdMiddleware = require('./middlewares/userIdMiddleware');

const app = express();

// Middlewares globais
app.use(express.json());  // Para aceitar JSON no corpo da requisição
app.use(cors());          // Para permitir requisições de diferentes origens
app.use(cookieParser());  // Para analisar cookies

// Middleware personalizado para verificar/gerar o userId
app.use(userIdMiddleware);

// Rota para a documentação
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Suas rotas
app.use(rotas);

app.listen(port, () => {
  console.log('Servidor rodando em http://localhost:' + port);
});
