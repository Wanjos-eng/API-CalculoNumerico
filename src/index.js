const { port } = require('./config/dotenv/dotenvConfig');
const express = require('express');
const rotas = require('./rotas');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger/docs/swagger.json');
const cookieParser = require('cookie-parser');
const userIdMiddleware = require('./middlewares/userIdMiddleware');

const app = express();

// Middlewares globais

// Configurar CORS com permissões específicas
/*app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://numericsolve.vercel.app'); // Substitua pela origem do seu front-end
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true'); // Permitir envio de cookies
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});*/

app.use(express.json());  // Para aceitar JSON no corpo da requisição
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
