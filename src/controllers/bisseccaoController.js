const { metodoBisseccao } = require('../metodosNumericos/bisseccao');
const { salvarContexto } = require('../services/contextoService');
const { validarParametros } = require('../services/validacaoParametros');

const bisseccao = async (req, res) => {
  const params = req.body;

  try {
    validarParametros('bisseccao', params);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    const resultado = metodoBisseccao(params.funcao, params.intervalo, params.tolerancia, params.maxIteracao);
    // Salvar o contexto usando o userId do cookie
    await salvarContexto(req.cookies.userId, { ...params, resultado });
    // Retornar o resultado ao cliente
    return res.status(200).json({ resultado });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  bisseccao
};
