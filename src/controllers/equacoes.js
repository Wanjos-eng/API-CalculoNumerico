const { metodoBisseccao } = require('../metodos/bisseccao');

const bisseccao = (req, res) => {
  const { metodo, funcao, intervalo, tolerancia, maxIteracao } = req.body;

  // Validação dos parâmetros recebidos
  if (!funcao || !intervalo || intervalo.length !== 2 || typeof tolerancia !== 'number' || typeof maxIteracao !== 'number') {
    return res.status(400).json({ error: 'Parâmetros inválidos. Verifique a função, intervalo, tolerância e número máximo de iterações.' });
  }

  let resultado;
  switch (metodo) {
    case 'bisseccao':
      resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);
      break;
    default:
      return res.status(400).json({ error: 'Método inválido!' });
  }

  // Retorna o resultado do cálculo
  return res.json({ resultado });
};

module.exports = {
  bisseccao
};
