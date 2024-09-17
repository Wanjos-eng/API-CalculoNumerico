const NodeCache = require('node-cache');
const contextoCache = new NodeCache({ stdTTL: 3600 }); // TTL padrão de 1 hora

const salvarContexto = async (chave, dados) => {
  contextoCache.set(chave, dados);
};

const recuperarContexto = async (chave) => {
  return contextoCache.get(chave);
};

module.exports = { salvarContexto, recuperarContexto };

