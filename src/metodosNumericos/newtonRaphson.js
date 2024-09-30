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
      error: 'Não foi possível calcular a derivada da função.',
      iteracao: 0,
      xAtual: chuteInicial,
      valorFuncao: null
    };
  }

  const df = derivadaSimbolica.compile();

  let x = chuteInicial;
  let fx = f.evaluate({ x: x });
  let dfx = df.evaluate({ x: x });

  // Verificação se o valor da função é muito grande no chute inicial
  if (Math.abs(fx) > 100) { // Ajuste este limite conforme necessário
    return {
      error: 'Chute inicial muito longe da raiz.',
      iteracao: 0,
      xAtual: x,
      valorFuncao: fx
    };
  }

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
    derivada: derivadaSimbolica.toString(),
    passos: passos
  };

  return { resultado };
};

module.exports = { metodoNewtonRaphson };
