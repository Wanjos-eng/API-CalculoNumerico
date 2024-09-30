const math = require('mathjs'); // Importa a biblioteca mathjs
const { validarParametros } = require('../services/validacaoParametros');

const metodoFalsaPosicao = (funcao, intervalo, tolerancia, maxIteracao) => {
  // Valida os parâmetros de entrada
  validarParametros('falsaPosicao', { funcao, intervalo, tolerancia, maxIteracao });

  let [a, b] = intervalo;
  let fa = math.evaluate(funcao, { x: a });
  let fb = math.evaluate(funcao, { x: b });

  //console.log(`fa: ${fa}, fb: ${fb}`); // Para verificar os valores de fa e fb

  // Verifica se há mudança de sinal no intervalo
  if (fa === 0 || fb === 0) {
    // Se uma das funções é zero, a raiz foi encontrada
    return { raiz: fa === 0 ? a : b, iteracoes: 0, erro: 0, convergiu: true, motivoParada: 'Raiz exata encontrada' };
  } else if (fa * fb > 0) {  // Se ambos têm sinais iguais
    throw new Error('Não há raiz no intervalo fornecido, f(a) e f(b) devem ter sinais opostos, a função deve mudar de sinal no intervalo dado.');
  }

  let iteracao = 0;
  let x, fx;

  while (iteracao < maxIteracao) {
    // Método da falsa posição
    x = (a * fb - b * fa) / (fb - fa);
    fx = math.evaluate(funcao, { x });

    // Verifica se a tolerância foi atingida
    if (Math.abs(fx) < tolerancia || Math.abs(b - a) < tolerancia) {
      return { raiz: x, iteracoes: iteracao + 1, erro: Math.abs(fx), convergiu: true, motivoParada: 'Tolerância atingida' };
    }

    // Atualiza os extremos do intervalo
    if (fa * fx < 0) {
      b = x;
      fb = fx;
    } else {
      a = x;
      fa = fx;
    }

    iteracao++;
  }

  // Caso não convergir dentro do número máximo de iterações
  throw new Error('Número máximo de iterações atingido sem convergência.'); 
};

module.exports = { metodoFalsaPosicao };
