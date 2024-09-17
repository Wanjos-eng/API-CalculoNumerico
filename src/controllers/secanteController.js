const { metodoSecante } = require('../metodosNumericos/secante');
const { salvarContexto } = require('../services/contextoService');
const { validarParametros } = require('../services/validacaoParametros');

const secante = async (req, res) => {
  const params = req.body;

  try {
    validarParametros('secante', params);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    const resultado = metodoSecante(params.funcao, params.x0, params.x1, params.tolerancia, params.maxIteracao);
    await salvarContexto(req.cookies.userId, { ...params, resultado });
    return res.status(200).json({ resultado });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  secante
};
