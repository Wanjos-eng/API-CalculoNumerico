const math = require('mathjs');
const { validarParametros } = require('../services/validacaoParametros');

const metodoBisseccao = (funcao, intervalo, tolerancia, maxIteracao) => {
  // Validações de entrada
  validarParametros('bisseccao', { funcao, intervalo, tolerancia, maxIteracao });

  // Compilando a função recebida
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
    throw new Error('A função não muda de sinal no intervalo dado. As raízes não podem ser garantidas no intervalo [a, b].');
  }

  let passos = [];
  let iteracao = 0;
  let c, fc, erro;

  while (iteracao < maxIteracao) {
    // Calculando o ponto médio
    c = (a + b) / 2;
    fc = f.evaluate({ x: c });
    erro = Math.abs(b - a) / 2;

    // Verifica se há descontinuidade no ponto médio
    if (!isFinite(fc) || isNaN(fc)) {
      throw new Error('A função parece ter uma descontinuidade no ponto médio do intervalo fornecido.');
    }

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
    if (Math.abs(fc) < tolerancia || erro < tolerancia) {
      return {
        resultado: {
          raiz: c,
          valorFuncao: fc,
          iteracoes: iteracao + 1,
          convergiu: true,
          erro: erro,
          motivoParada: Math.abs(fc) === 0 ? 'Raiz encontrada com precisão total' : 'Tolerância atingida',
          passos: passos
        }
      };
    }

    iteracao++;
  }

  // Se atingiu o máximo de iterações
  return {
    resultado: {
      raiz: c,
      valorFuncao: fc,
      iteracoes: maxIteracao,
      convergiu: false,
      erro: erro,
      motivoParada: 'Número máximo de iterações atingido',
      passos: passos
    }
  };
};

module.exports = { metodoBisseccao };
