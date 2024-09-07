const { port } = require('./config');
const express = require('express');
const rotas = require('./rotas');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

const app = express();

// Rota para a documentação
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());  // Para aceitar JSON no corpo da requisição
app.use(cors());  // Para permitir requisições de diferentes origens

app.use(rotas);

app.listen(port, () => {
  console.log('Servidor rodando em http://localhost:' + port);
});
