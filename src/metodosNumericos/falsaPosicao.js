const math = require('mathjs');
const { validarParametros } = require('../services/validacaoParametros');

const metodoFalsaPosicao = (funcao, intervalo, tolerancia, maxIteracao) => {
  // Validação dos parâmetros usando a função externa
  validarParametros(funcao, intervalo, tolerancia, maxIteracao);

  const f = math.compile(funcao);
  let [a, b] = intervalo;
  let fa = f.evaluate({ x: a });
  let fb = f.evaluate({ x: b });

  if (fa * fb >= 0) {
    return { 
      error: 'A função deve mudar de sinal no intervalo dado.',
      fa: fa,
      fb: fb
    };
  }

  let passos = [];
  let iteracao = 0;
  let c, fc, erro;

  while (iteracao < maxIteracao) {
    c = (a * fb - b * fa) / (fb - fa);
    fc = f.evaluate({ x: c });
    erro = Math.abs(fc);

    let intervaloAtual = { a, b };
    let descricao = '';

    if (fa * fc < 0) {
      descricao = `A função muda de sinal entre [${a}, ${c}].`;
      b = c;
      fb = fc;
    } else {
      descricao = `A função muda de sinal entre [${c}, ${b}].`;
      a = c;
      fa = fc;
    }

    passos.push({
      iteracao: iteracao + 1,
      intervaloAtual: { a: intervaloAtual.a, b: intervaloAtual.b },
      pontoFalsaPosicao: c,
      valorFuncao: fc,
      erro: erro,
      descricao: descricao
    });

    if (erro < tolerancia || Math.abs(b - a) < tolerancia) {
      break;
    }

    iteracao++;
  }

  const convergiu = erro < tolerancia;
  const motivoParada = convergiu ? 'Tolerância atingida' : 
                        (iteracao === maxIteracao ? 'Número máximo de iterações atingido' : 'Intervalo menor que a tolerância');

  const resultado = {
    raiz: c,
    valorFuncao: fc,
    iteracoes: iteracao + 1,
    convergiu: convergiu,
    erro: erro,
    motivoParada: motivoParada,
    passos: passos
  };

  return { resultado };
};

module.exports = { metodoFalsaPosicao };
