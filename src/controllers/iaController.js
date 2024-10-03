const { recuperarContexto } = require('../services/contextoService');
const { enviarPerguntaIA } = require('../services/geminiService');

const perguntarIA = async (req, res) => {
  const userId = req.cookies.userId;
  if (!userId) {
    console.error('Erro: userId não encontrado nos cookies.');
    return res.status(400).json({ error: 'userId não encontrado nos cookies.' });
  }

  const ultimaExecucao = await recuperarContexto(userId);

  if (!ultimaExecucao) {
    console.error('Erro: Nenhum contexto encontrado para o userId:', userId);
    return res.status(400).json({ error: 'Nenhum contexto encontrado.' });
  }

  const { pergunta } = req.body;
  if (!pergunta) {
    console.error('Erro: Pergunta não fornecida.');
    return res.status(400).json({ error: 'Pergunta não fornecida.' });
  }

  try {
    const respostaIA = await enviarPerguntaIA(ultimaExecucao, pergunta);
    return res.json({ contexto: ultimaExecucao, respostaIA });
  } catch (error) {
    console.error('Erro ao enviar pergunta à IA:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { perguntarIA };
