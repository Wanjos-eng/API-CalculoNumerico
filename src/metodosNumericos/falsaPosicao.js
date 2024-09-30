const math = require('mathjs'); // Importa a biblioteca mathjs
const { validarParametros } = require('../services/validacaoParametros');

const metodoFalsaPosicao = (funcao, intervalo, tolerancia, maxIteracao) => {
  // Valida os parâmetros de entrada
  validarParametros('falsaPosicao', { funcao, intervalo, tolerancia, maxIteracao });

  let [a, b] = intervalo;
  let fa = math.evaluate(funcao, { x: a });
  let fb = math.evaluate(funcao, { x: b });

  // Array para armazenar os passos
  const passos = [];

  // Verificação se a raiz está em um dos extremos
  if (fa === 0) {
    return {
      resultado: {
        raiz: a,
        valorFuncao: fa,
        iteracoes: 0,
        convergiu: true,
        erro: 0,
        motivoParada: 'Raiz exata encontrada',
        passos: []
      }
    };
  }
  if (fb === 0) {
    return {
      resultado: {
        raiz: b,
        valorFuncao: fb,
        iteracoes: 0,
        convergiu: true,
        erro: 0,
        motivoParada: 'Raiz exata encontrada',
        passos: []
      }
    };
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
      return {
        resultado: {
          raiz: x,
          valorFuncao: fx,
          iteracoes: iteracao + 1,
          convergiu: true,
          erro: Math.abs(fx),
          motivoParada: 'Tolerância atingida',
          passos
        }
      };
    }

    // Atualiza os extremos do intervalo
    if (fa * fx < 0) {
      b = x;
      fb = fx;
    } else {
      a = x;
      fa = fx;
    }

    // Armazena os passos
    passos.push({
      iteracao: iteracao + 1,
      intervaloAtual: { a, b },
      pontoFalsaPosicao: x,
      valorFuncao: fx,
      erro: Math.abs(fx),
      descricao: 'Atualização do intervalo'
    });

    iteracao++;
  }

  // Caso não convergir dentro do número máximo de iterações
  return {
    resultado: {
      raiz: null, // ou x, se quiser retornar o último valor de x calculado
      valorFuncao: fx,
      iteracoes: iteracao,
      convergiu: false,
      erro: Math.abs(fx),
      motivoParada: 'Número máximo de iterações atingido sem convergência.',
      passos
    }
  };
};

module.exports = { metodoFalsaPosicao };
