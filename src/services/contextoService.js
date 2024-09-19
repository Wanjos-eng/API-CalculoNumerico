// Config de cache usada no desenvolvimento
/*const NodeCache = require('node-cache');
const contextoCache = new NodeCache({ stdTTL: 3600 }); // TTL padrão de 1 hora

const salvarContexto = async (chave, dados) => {
  contextoCache.set(chave, dados);
};

const recuperarContexto = async (chave) => {
  return contextoCache.get(chave);
};

module.exports = { salvarContexto, recuperarContexto };
*/

//Config de cache usada no ambiente de produção
// services/contextoService.js
const redis = require('redis');

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  },
  password: process.env.REDIS_PASSWORD || undefined, // Se o Redis exigir autenticação
});

client.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  await client.connect();
})();

const salvarContexto = async (chave, dados) => {
  try {
    await client.set(chave, JSON.stringify(dados), { EX: 3600 }); // Expiração em 1 hora
  } catch (error) {
    console.error('Erro ao salvar no cache:', error);
  }
};

const recuperarContexto = async (chave) => {
  try {
    const data = await client.get(chave);
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao recuperar o contexto:', error);
    return null;
  }
};

module.exports = { salvarContexto, recuperarContexto };
