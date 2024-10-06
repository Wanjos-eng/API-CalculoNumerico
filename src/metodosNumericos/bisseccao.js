const math = require('mathjs');
const { validarParametros } = require('../services/validacaoParametros');

const metodoBisseccao = (funcao, intervalo, tolerancia, maxIteracao) => {
  // Validações de entrada
  validarParametros('bisseccao', { funcao, intervalo, tolerancia, maxIteracao });

  function obterCasasDecimais(tolerancia) {
    const strTolerancia = tolerancia.toString();
    if (strTolerancia.includes('.')) {
        return strTolerancia.split('.')[1].length;
    }
    return 0; // Se a tolerância for um número inteiro, não há casas decimais.
  }

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
        motivoParada: 'Raiz encontrada no extremo inferior do intervalo',
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
        motivoParada: 'Raiz encontrada no extremo superior do intervalo',
        passos: []
      }
    };
  }

  let passos = [];
  let iteracao = 0;
  let c = a; // Inicializa c com a para evitar undefined
  let fc = fa;
  let erro = tolerancia + 1; // Inicializa erro com um valor maior que a tolerância
  let convergiu = false;
  let n = obterCasasDecimais(tolerancia);

  while (iteracao < maxIteracao && Number(erro.toFixed(n)) > Number(tolerancia.toFixed(n))) {
    // Calculando o ponto médio
    c = (a + b) / 2;
    fc = f.evaluate({ x: c });
    erro = Math.abs(fc);

    // Verifica se há descontinuidade no ponto médio
    if (!isFinite(fc) || isNaN(fc)) {
      return {
        resultado: {
          valorFuncao: fc,
          iteracoes: iteracao + 1,
          convergiu: false,
          erro: null,
          motivoParada: 'Descontinuidade detectada no ponto médio',
          passos
        }
      };
    }

    // Determinando o próximo intervalo
    let intervaloAtual = { a, b };
    let descricao = '';

    if (fa * fc < 0) {
      descricao = `A função muda de sinal entre [${a}, ${c}]. Novo intervalo: [${a}, ${c}]`;
      b = c;
      fb = fc;
    } else {
      descricao = `A função muda de sinal entre [${c}, ${b}]. Novo intervalo: [${c}, ${b}]`;
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

    iteracao++;
  }

  // Verifica se convergiu
  if (erro.toFixed(n) <= tolerancia.toFixed(n)) {
    convergiu = true;
  }

  const motivoParada = convergiu
    ? 'Tolerância atingida'
    : 'Número máximo de iterações atingido sem convergência.';

  const resultado = {
    valorFuncao: fc,
    iteracoes: iteracao,
    convergiu,
    erro,
    motivoParada,
    passos: passos
  };

  if (convergiu) {
    resultado.raiz = c;
  }

  return { resultado };
};

module.exports = { metodoBisseccao };
