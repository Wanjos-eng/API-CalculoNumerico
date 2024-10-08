const math = require('mathjs');
const { validarParametros } = require('../services/validacaoParametros');

const metodoFalsaPosicao = (funcao, intervalo, tolerancia, maxIteracao) => {
  // Valida os parâmetros de entrada
  validarParametros('falsaPosicao', { funcao, intervalo, tolerancia, maxIteracao });

  function obterCasasDecimais(tolerancia) {
    const strTolerancia = tolerancia.toString();
    if (strTolerancia.includes('.')) {
        return strTolerancia.split('.')[1].length;
    }
    return 0; // Se a tolerância for um número inteiro, não há casas decimais.
  }

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
        fxAprox: fa,
        iteracoes: 0,
        convergiu: true,
        erro: 0,
        motivoParada: 'Raiz exata encontrada no extremo inferior',
        passos: []
      }
    };
  }

  if (fb === 0) {
    return {
      resultado: {
        raiz: b,
        fxAprox: fb,
        iteracoes: 0,
        convergiu: true,
        erro: 0,
        motivoParada: 'Raiz exata encontrada no extremo superior',
        passos: []
      }
    };
  }

  let iteracao = 0;
  let x = a; // Inicializa x com a para evitar undefined
  let fx = fa;
  let erro = tolerancia + 1; // Inicializa erro com um valor maior que a tolerância
  let convergiu = false;
  let n = obterCasasDecimais(tolerancia);

  while (iteracao < maxIteracao && Number(erro.toFixed(n)) > Number(tolerancia.toFixed(n))) {
    // Método da falsa posição
    x = (a * fb - b * fa) / (fb - fa);
    fx = math.evaluate(funcao, { x });
    erro = Math.abs(fx);

    // Descrição e atualização do intervalo
    let descricao = '';
    if (fa * fx < 0) {
      descricao = `A função muda de sinal entre [${a}, ${x}]. Novo intervalo: [${a}, ${x}]`;
      b = x;
      fb = fx;
    } else {
      descricao = `A função muda de sinal entre [${x}, ${b}]. Novo intervalo: [${x}, ${b}]`;
      a = x;
      fa = fx;
    }

    // Armazena os passos
    passos.push({
      iteracao: iteracao + 1,
      intervaloAtual: { a, b },
      xAprox: x,
      fxAprox: fx,
      erro,
      descricao
    });

    iteracao++;
  }

  // Verifica se convergiu
  if (erro.toFixed(n) <= tolerancia.toFixed(n)) {
    convergiu = true;
  }

  const motivoParada = convergiu
    ? 'Tolerância atingida'
    : 'Número máximo de iterações atingido sem convergência.';

  const resultado = {
    fxAprox: fx,
    iteracoes: iteracao,
    convergiu,
    erro,
    motivoParada,
    passos
  };

  if (convergiu) {
    resultado.raiz = x;
  }

  return { resultado };
};

module.exports = { metodoFalsaPosicao };
