const math = require('mathjs');
const { validarParametros } = require('../services/validacaoParametros');

const metodoNewtonRaphson = (funcao, chuteInicial, tolerancia, maxIteracao) => {
  validarParametros('newtonRaphson', { funcao, chuteInicial, tolerancia, maxIteracao });

  function obterCasasDecimais(tolerancia) {
    const strTolerancia = tolerancia.toString();
    if (strTolerancia.includes('.')) {
        return strTolerancia.split('.')[1].length;
    }
    return 0; // Se a tolerância for um número inteiro, não há casas decimais.
  }

  const f = math.compile(funcao);

  // Calcular a derivada simbolicamente
  let derivadaSimbolica;
  try {
    derivadaSimbolica = math.derivative(funcao, 'x');
  } catch (error) {
    return {
      resultado: {
        fxAprox: f.evaluate({ x: chuteInicial }),
        iteracoes: 0,
        convergiu: false,
        erro: null,
        motivoParada: 'Não foi possível calcular a derivada da função.',
        passos: []
      }
    };
  }

  const df = derivadaSimbolica.compile();

  let x = chuteInicial;
  let fx = f.evaluate({ x });
  let dfx = df.evaluate({ x });

  let iteracao = 0;
  let erro = tolerancia + 1; // Inicializa erro com um valor maior que a tolerância
  let convergiu = false;
  let passos = [];
  let n = obterCasasDecimais(tolerancia);

  while (iteracao < maxIteracao && Number(erro.toFixed(n)) > Number(tolerancia.toFixed(n))) {
    if (Math.abs(dfx) < 1e-10) {
      return {
        resultado: {
          fxAprox: fx,
          iteracoes: iteracao,
          convergiu: false,
          erro,
          motivoParada: 'Derivada próxima de zero. Método falhou.',
          passos
        }
      };
    }

    const xAprox = x - fx / dfx;
    const fxAprox = f.evaluate({ x: xAprox });
    erro = Math.abs(fxAprox);

    passos.push({
      iteracao: iteracao + 1,
      xAtual: x,
      fxAtual: fx,
      derivada: dfx,
      xAprox,
      fxAprox,
      descricao: `Iteração ${iteracao + 1}: x = ${xAprox}`
    });

    x = xAprox;
    fx = fxAprox;
    dfx = df.evaluate({ x });

    iteracao++;
  }

  // Verifica se convergiu
  if (erro.toFixed(n) <= tolerancia.toFixed(n)) {
    convergiu = true;
  }

  const motivoParada = convergiu
    ? 'Tolerância atingida'
    : 'Número máximo de iterações atingido sem convergência';

  const resultado = {
    fxAprox: fx,
    iteracoes: iteracao,
    convergiu,
    erro,
    motivoParada,
    derivada: derivadaSimbolica.toString(),
    passos
  };

  if (convergiu) {
    resultado.raiz = x;
  }

  return { resultado };
};

module.exports = { metodoNewtonRaphson };
