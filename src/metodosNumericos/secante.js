const math = require('mathjs');
const { validarParametros } = require('../services/validacaoParametros');

const metodoSecante = (funcao, x0, x1, tolerancia, maxIteracao) => {
    // Validação inicial dos parâmetros fornecidos
    validarParametros('secante', { funcao, x0, x1, tolerancia, maxIteracao });

    // Inicializa variáveis para iterações
    let iteracao = 0;
    let erro = tolerancia + 1;
    let xPrev = x0;
    let xCurr = x1;

    // Iteração do método da secante
    while (erro > tolerancia && iteracao < maxIteracao) {
        // Calcula o valor da função para os pontos atuais
        const fXPrev = math.evaluate(funcao, { x: xPrev });
        const fXCurr = math.evaluate(funcao, { x: xCurr });

        // Verifica se a função retorna um valor inválido (possível descontinuidade)
        if (!isFinite(fXCurr)) {
            throw new Error('A função parece ter uma descontinuidade.');
        }

        // Verifica divisão por zero com uma tolerância numérica pequena
        if (Math.abs(fXCurr - fXPrev) < 1e-12) {
          // Se os valores estão muito próximos de zero, podemos considerar que é uma raiz múltipla
          if (Math.abs(fXCurr) < 1e-12 && Math.abs(fXPrev) < 1e-12) {
              throw new Error('Raiz múltipla detectada. Não é possível continuar o cálculo.');
          } else {
              throw new Error('Divisão por zero detectada. Não é possível continuar o cálculo.');
          }
      }
               
        // Fórmula do método da secante
        const xNext = xCurr - (fXCurr * (xCurr - xPrev)) / (fXCurr - fXPrev);

        // Atualiza erro e variáveis
        erro = Math.abs(xNext - xCurr);
        xPrev = xCurr;
        xCurr = xNext;
        iteracao++;
    }

    // Verifica se o método convergiu
    if (erro > tolerancia) {
        throw new Error('O método da secante não convergiu dentro do número máximo de iterações.');
    }

    // Retorna a raiz aproximada e o número de iterações
    return { raiz: xCurr, iteracoes: iteracao };
};

module.exports = { metodoSecante };
