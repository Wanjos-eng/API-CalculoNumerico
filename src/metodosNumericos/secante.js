const math = require('mathjs');
const { validarParametros } = require('../services/validacaoParametros');

const metodoSecante = (funcao, intervalo, tolerancia, maxIteracao) => {
  // Validação inicial dos parâmetros fornecidos
  validarParametros('secante', { funcao, intervalo, tolerancia, maxIteracao });

  function obterCasasDecimais(tolerancia) {
    const strTolerancia = tolerancia.toString();
    if (strTolerancia.includes('.')) {
        return strTolerancia.split('.')[1].length;
    }
    return 0; // Se a tolerância for um número inteiro, não há casas decimais.
  }

  let [a, b] = intervalo;
  const f = math.compile(funcao);

  let fa = f.evaluate({ x: a });
  let fb = f.evaluate({ x: b });
  let iteracao = 0;
  let erro = tolerancia + 1; // Inicializa erro com um valor maior que a tolerância
  const passos = [];
  let convergiu = false;
  let n = obterCasasDecimais(tolerancia);

  while (iteracao < maxIteracao && Number(erro.toFixed(n)) >= Number(tolerancia.toFixed(n))) {
    if (!isFinite(fa) || !isFinite(fb)) {
      return {
        resultado: {
          valorFuncao: fb,
          iteracoes: iteracao,
          convergiu: false,
          erro: null,
          motivoParada: 'Descontinuidade detectada',
          passos
        }
      };
    }

    if (Math.abs(fb - fa) < 1e-12) {
      let motivoParada = 'Divisão por zero detectada';
      if (Math.abs(fb) < 1e-12 && Math.abs(fa) < 1e-12) {
        motivoParada = 'Raiz múltipla detectada';
      }
      return {
        resultado: {
          valorFuncao: fb,
          iteracoes: iteracao,
          convergiu: false,
          erro: null,
          motivoParada,
          passos
        }
      };
    }

    // Método da Secante
    const c = b - fb * (b - a) / (fb - fa);
    const fc = f.evaluate({ x: c });
    erro = Math.abs(fc);

    // Descrição do passo atual, incluindo o intervalo atual [a, b]
    const descricao = `Iteração ${iteracao + 1}: Intervalo atual [${a}, ${b}], novo ponto c = ${c}`;

    // Armazena os passos
    passos.push({
      iteracao: iteracao + 1,
      a,
      b,
      c,
      fa,
      fb,
      fc,
      erro,
      descricao
    });

    // Atualiza as variáveis para a próxima iteração
    a = b;
    fa = fb;
    b = c;
    fb = fc;

    iteracao++;
  }

  // Verifica se convergiu
  if (erro.toFixed(n) <= tolerancia.toFixed(n)) {
    convergiu = true;
  }

  const motivoParada = convergiu
    ? 'Tolerância atingida'
    : 'Número máximo de iterações atingido sem convergência';

  const resultado = {
    valorFuncao: fb,
    iteracoes: iteracao,
    convergiu,
    erro,
    motivoParada,
    passos
  };

  if (convergiu) {
    resultado.raiz = b;
  }

  return { resultado };
};

module.exports = { metodoSecante };
