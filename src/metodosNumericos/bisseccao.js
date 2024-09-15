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

  const convergiu = erro < tolerancia;
  const motivoParada = convergiu ? 'Tolerância atingida' : 
                        (iteracao === maxIteracao ? 'Número máximo de iterações atingido' : 'Intervalo menor que a tolerância');

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
