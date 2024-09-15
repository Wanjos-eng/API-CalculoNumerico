const math = require('mathjs');
const { validarParametros } = require('../services/validacaoParametros');

const metodoNewtonRaphson = (funcao, derivada, chuteInicial, tolerancia, maxIteracao) => {
  validarParametros('newtonRaphson', { funcao, derivada, chuteInicial, tolerancia, maxIteracao });

  const f = math.compile(funcao);
  const df = math.compile(derivada);

  let x = chuteInicial;
  let fx = f.evaluate({ x: x });
  let dfx = df.evaluate({ x: x });

  let iteracao = 0;
  let erro = Math.abs(fx);
  let passos = [];

  while (erro > tolerancia && iteracao < maxIteracao) {
    if (Math.abs(dfx) < 1e-10) {
      return { 
        error: 'Derivada próxima de zero. Método falhou.',
        iteracao: iteracao,
        xAtual: x,
        valorFuncao: fx
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
      xNovo: xNovo,
      erro: erro
    });

    x = xNovo;
    fx = fxNovo;
    dfx = df.evaluate({ x: xNovo });

    iteracao++;
  }

  const convergiu = erro < tolerancia;
  const motivoParada = convergiu ? 'Tolerância atingida' : 'Número máximo de iterações atingido';

  const resultado = {
    raiz: x,
    valorFuncao: fx,
    iteracoes: iteracao,
    convergiu: convergiu,
    erro: erro,
    motivoParada: motivoParada,
    passos: passos
  };

  return { resultado };
};

module.exports = { metodoNewtonRaphson };
