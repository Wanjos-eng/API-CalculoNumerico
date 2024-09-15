const { metodoSecante } = require('../metodosNumericos/secante');

const secante = (req, res) => {
  const { funcao, x0, x1, tolerancia, maxIteracao } = req.body;

  // Validação dos parâmetros recebidos
  if (!funcao || typeof x0 !== 'number' || typeof x1 !== 'number' || typeof tolerancia !== 'number' || typeof maxIteracao !== 'number') {
    return res.status(400).json({ error: 'Parâmetros inválidos. Verifique a função, os pontos iniciais, tolerância e número máximo de iterações.' });
  }

  try {
    // Executa o método da Secante
    const resultado = metodoSecante(funcao, x0, x1, tolerancia, maxIteracao);

    // Retorna o resultado do cálculo
    return res.json({ resultado });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  secante
};
