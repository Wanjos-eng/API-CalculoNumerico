const express = require('express');
const { port } = require('./config/dotenv/dotenvConfig');
const rotas = require('./rotas');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger/docs/swagger.json');
const cookieParser = require('cookie-parser');
const userIdMiddleware = require('./middlewares/userIdMiddleware');
const cors = require('cors');
const corsOptions = require('./config/cors/corsConfig');

const app = express();

// Middlewares globais

// Configurar CORS com permissões específicas
app.use(cors(corsOptions));
app.use(express.json());  // Para aceitar JSON no corpo da requisição
app.use(cookieParser());  // Para analisar cookies

// Middleware personalizado para verificar/gerar o userId
app.use(userIdMiddleware);

// Rota para a documentação
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas dos controllers
app.use(rotas);

app.listen(port, () => {
  console.log('Servidor rodando em http://localhost:' + port);
});
