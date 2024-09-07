const { metodoFalsaPosicao } = require('../metodosNumericos/falsaPosicao');

const falsaPosicao = (req, res) => {
  const { funcao, intervalo, tolerancia, maxIteracao } = req.body;

  // Validação dos parâmetros recebidos
  if (!funcao || !intervalo || intervalo.length !== 2 || typeof tolerancia !== 'number' || typeof maxIteracao !== 'number') {
    return res.status(400).json({ error: 'Parâmetros inválidos. Verifique a função, intervalo, tolerância e número máximo de iterações.' });
  }

  try {
    // Executa o método da Falsa Posição
    const resultado = metodoFalsaPosicao(funcao, intervalo, tolerancia, maxIteracao);

    // Retorna o resultado do cálculo
    return res.json({ resultado });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  falsaPosicao
};
