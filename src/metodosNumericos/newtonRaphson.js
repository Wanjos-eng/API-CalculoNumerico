const math = require('mathjs');
const { validarParametros } = require('../services/validacaoParametros');

const metodoNewtonRaphson = (funcao, chuteInicial, tolerancia, maxIteracao) => {
  validarParametros('newtonRaphson', { funcao, chuteInicial, tolerancia, maxIteracao });

  const f = math.compile(funcao);

  // Calcular a derivada simbolicamente
  let derivadaSimbolica;
  try {
    derivadaSimbolica = math.derivative(funcao, 'x');
  } catch (error) {
    return {
      resultado: {
        valorFuncao: f.evaluate({ x: chuteInicial }),
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

  while (iteracao < maxIteracao && erro > tolerancia) {
    if (Math.abs(dfx) < 1e-10) {
      return {
        resultado: {
          valorFuncao: fx,
          iteracoes: iteracao,
          convergiu: false,
          erro,
          motivoParada: 'Derivada próxima de zero. Método falhou.',
          passos
        }
      };
    }

    const xNovo = x - fx / dfx;
    const fxNovo = f.evaluate({ x: xNovo });
    erro = Math.abs(xNovo - x);

    passos.push({
      iteracao: iteracao + 1,
      xAtual: x,
      valorFuncao: fx,
      derivada: dfx,
      xNovo,
      erro,
      descricao: `Iteração ${iteracao + 1}: x = ${xNovo}`
    });

    x = xNovo;
    fx = fxNovo;
    dfx = df.evaluate({ x });

    iteracao++;
  }

  // Verifica se convergiu
  if (erro <= tolerancia) {
    convergiu = true;
  }

  const motivoParada = convergiu
    ? 'Tolerância atingida'
    : 'Número máximo de iterações atingido sem convergência';

  const resultado = {
    valorFuncao: fx,
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
