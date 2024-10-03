const { metodoFalsaPosicao } = require('../metodosNumericos/falsaPosicao');
const { salvarContexto } = require('../services/contextoService');
const { validarParametros } = require('../services/validacaoParametros');

const falsaPosicao = async (req, res) => {
  const params = req.body;

  try {
    validarParametros('falsaPosicao', params);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    const resultadoMetodo = metodoFalsaPosicao(
      params.funcao,
      params.intervalo,
      params.tolerancia,
      params.maxIteracao
    );

    await salvarContexto(req.cookies.userId, { ...params, resultado: resultadoMetodo.resultado });

    return res.status(200).json(resultadoMetodo);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  falsaPosicao
};
