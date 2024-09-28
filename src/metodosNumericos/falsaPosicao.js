const math = require('mathjs');
const { validarParametros } = require('../services/validacaoParametros');

const metodoFalsaPosicao = (funcao, intervalo, tolerancia, maxIteracao) => {
  // Validação dos parâmetros usando a função externa
  validarParametros('falsaPosicao', { funcao, intervalo, tolerancia, maxIteracao });

  const f = math.compile(funcao);
  let [a, b] = intervalo;
  let fa = f.evaluate({ x: a });
  let fb = f.evaluate({ x: b });

  // Verificação se a raiz está em um dos extremos
  if (fa === 0) {
    return {
      resultado: {
        raiz: a,
        valorFuncao: fa,
        iteracoes: 0,
        convergiu: true,
        erro: 0,
        motivoParada: 'Tolerância atingida',
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
        motivoParada: 'Tolerância atingida',
        passos: []
      }
    };
  }

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
    // Calcular o ponto de falsa posição
    c = (a * fb - b * fa) / (fb - fa);
    fc = f.evaluate({ x: c });
    erro = Math.abs(fc);

    let intervaloAtual = { a, b };
    let descricao = '';

    if (fa * fc < 0) {
      descricao = `A função muda de sinal entre [${a}, ${c}].`;
      b = c;
      fb = fc;
    } else if (fc * fb < 0) {
      descricao = `A função muda de sinal entre [${c}, ${b}].`;
      a = c;
      fa = fc;
    } else {
      // Caso em que fc é zero ou próximo de zero, encontramos a raiz
      break;
    }

    passos.push({
      iteracao: iteracao + 1,
      intervaloAtual: { a: intervaloAtual.a, b: intervaloAtual.b },
      pontoFalsaPosicao: c,
      valorFuncao: fc,
      erro: erro,
      descricao: descricao
    });

    // Critério de parada
    if (erro < tolerancia || Math.abs(b - a) < tolerancia) {
      break;
    }

    iteracao++;
  }

  const convergiu = erro < tolerancia;
  const motivoParada = convergiu ? 'Tolerância atingida' : 'Número máximo de iterações atingido';

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
