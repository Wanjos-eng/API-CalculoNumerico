const math = require('mathjs');
const { validarParametros } = require('../services/validacaoParametros');

const metodoSecante = (funcao, x0, x1, tolerancia, maxIteracao) => {
  validarParametros('secante', {funcao, x0, x1, tolerancia, maxIteracao});

  const f = math.compile(funcao);

  let x0_ = x0;
  let x1_ = x1;
  let fx0 = f.evaluate({ x: x0_ });
  let fx1 = f.evaluate({ x: x1_ });

  let iteracao = 0;
  let erro = Math.abs(x1_ - x0_);
  let passos = [];

  while (erro > tolerancia && iteracao < maxIteracao) {
    if (fx1 === fx0) {
      return {
        error: 'Divisão por zero, a função não deve ser constante no intervalo.',
        iteracao: iteracao,
        xAtual: x1_,
        valorFuncao: fx1
      };
    }

    // Cálculo do novo ponto
    const xNovo = x1_ - fx1 * (x1_ - x0_) / (fx1 - fx0);
    const fxNovo = f.evaluate({ x: xNovo });
    erro = Math.abs(xNovo - x1_);

    passos.push({
      iteracao: iteracao + 1,
      x0: x0_,
      x1: x1_,
      xNovo: xNovo,
      valorFuncao: fxNovo,
      erro: erro
    });

    x0_ = x1_;
    x1_ = xNovo;
    fx0 = fx1;
    fx1 = fxNovo;

    iteracao++;
  }

  const convergiu = erro < tolerancia;
  const motivoParada = convergiu ? 'Tolerância atingida' : 'Número máximo de iterações atingido';

  const resultado = {
    raiz: x1_,
    valorFuncao: fx1,
    iteracoes: iteracao,
    convergiu: convergiu,
    erro: erro,
    motivoParada: motivoParada,
    passos: passos
  };

  return { resultado };
};

module.exports = { metodoSecante };
