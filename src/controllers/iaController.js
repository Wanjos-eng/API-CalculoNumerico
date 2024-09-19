const { recuperarContexto } = require('../services/contextoService');
const { enviarPerguntaIA } = require('../services/geminiService');

const perguntarIA = async (req, res) => {
  const userId = req.cookies.userId;
  const ultimaExecucao = await recuperarContexto(userId);

  if (!ultimaExecucao) {
    return res.status(400).json({ error: 'Nenhum contexto encontrado.' });
  }

  const { pergunta } = req.body;
  if (!pergunta) {
    return res.status(400).json({ error: 'Pergunta não fornecida.' });
  }

  try {
    const respostaIA = await enviarPerguntaIA(ultimaExecucao, pergunta);
    return res.json({ contexto: ultimaExecucao, respostaIA });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { perguntarIA };
