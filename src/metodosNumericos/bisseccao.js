const math = require('mathjs');
const { validarParametros } = require('../services/validacaoParametros'); // Atualize a função de validação

const metodoBisseccao = (funcao, intervalo, tolerancia, maxIteracao) => {
  // Validações de entrada
  validarParametros('bisseccao', { funcao, intervalo, tolerancia, maxIteracao });

  const f = math.compile(funcao);
  let [a, b] = intervalo;
  let fa = f.evaluate({ x: a });
  let fb = f.evaluate({ x: b });

  // Teste do intervalo
  if (fa === 0) {
    return {
      resultado: {
        raiz: a,
        valorFuncao: fa,
        iteracoes: 0,
        convergiu: true,
        erro: 0,
        motivoParada: 'Raiz encontrada no extremo do intervalo',
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
        motivoParada: 'Raiz encontrada no extremo do intervalo',
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
    // Calculando o ponto médio
    c = (a + b) / 2;
    fc = f.evaluate({ x: c });
    erro = Math.abs(fc);

    // Determinando o próximo intervalo
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

    // Adicionando o passo atual ao array
    passos.push({
      iteracao: iteracao + 1,
      intervaloAtual: { a: intervaloAtual.a, b: intervaloAtual.b },
      pontoMedio: c,
      valorFuncao: fc,
      erro: erro,
      descricao: descricao
    });

    // Critérios de parada
    if (erro < tolerancia || Math.abs(b - a) < tolerancia) {
      break;
    }

    iteracao++;
  }

  const convergiu = erro < tolerancia || Math.abs(b - a) < tolerancia;
  const motivoParada = convergiu ? 'Tolerância atingida' : 'Número máximo de iterações atingido';

  // Estruturando o resultado
  const resultado = {
    raiz: c,
    valorFuncao: fc,
    iteracoes: iteracao,
    convergiu: convergiu,
    erro: erro,
    motivoParada: motivoParada,
    passos: passos
  };

  return { resultado };
};

module.exports = { metodoBisseccao };
