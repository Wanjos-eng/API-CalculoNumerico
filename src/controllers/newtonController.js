const { metodoNewtonRaphson } = require('../metodosNumericos/newtonRaphson');

const newtonRaphson = (req, res) => {
  const { funcao, derivada, chuteInicial, tolerancia, maxIteracao } = req.body;

  if (!funcao || !derivada || typeof chuteInicial !== 'number' || typeof tolerancia !== 'number' || typeof maxIteracao !== 'number') {
    return res.status(400).json({ error: 'Parâmetros inválidos. Verifique a função, derivada, chute inicial, tolerância e número máximo de iterações.' });
  }

  try {
    const resultado = metodoNewtonRaphson(funcao, derivada, chuteInicial, tolerancia, maxIteracao);

    if (resultado.error) {
      return res.status(400).json({ error: resultado.error });
    }

    return res.json({ resultado });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  newtonRaphson
};
