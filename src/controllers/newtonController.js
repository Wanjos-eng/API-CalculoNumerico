const { metodoNewtonRaphson } = require('../metodosNumericos/newtonRaphson');
const { salvarContexto } = require('../services/contextoService');
const { validarParametros } = require('../services/validacaoParametros');

const newtonRaphson = async (req, res) => {
  const params = req.body;

  try {
    validarParametros('newtonRaphson', params);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    const resultadoMetodo = metodoNewtonRaphson(
      params.funcao,
      params.chuteInicial,
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
  newtonRaphson
};
