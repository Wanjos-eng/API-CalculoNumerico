const math = require('mathjs');
const { validarParametros } = require('../services/validacaoParametros');

const metodoSecante = (funcao, x0, x1, tolerancia, maxIteracao) => {
    // Validação inicial dos parâmetros fornecidos
    validarParametros('secante', { funcao, x0, x1, tolerancia, maxIteracao });

    // Inicializa variáveis para iterações e registro de passos
    let iteracao = 0;
    let erro = tolerancia + 1;
    let xPrev = x0;
    let xCurr = x1;
    const passos = [];  // Armazena os passos de cada iteração
    let raiz = null; 

    // Iteração do método da secante
    while (erro > tolerancia && iteracao < maxIteracao) {
        // Calcula o valor da função para os pontos atuais
        const fXPrev = math.evaluate(funcao, { x: xPrev });
        const fXCurr = math.evaluate(funcao, { x: xCurr });

        // Verifica se a função retorna um valor inválido (possível descontinuidade)
        if (!isFinite(fXCurr) || !isFinite(fXPrev)) {
            return {
                raiz: xCurr, // Retorna o último valor calculado
                valorFuncao: fXCurr,
                iteracoes: iteracao,
                convergiu: false,
                erro: erro,
                motivoParada: 'Descontinuidade detectada',
                passos
            };
        }

        // Verifica divisão por zero com uma tolerância numérica pequena
        if (Math.abs(fXCurr - fXPrev) < 1e-12) {
            let motivoParada = 'Divisão por zero detectada';
            if (Math.abs(fXCurr) < 1e-12 && Math.abs(fXPrev) < 1e-12) {
                motivoParada = 'Raiz múltipla detectada';
            }
            return {
                raiz: xCurr, // Retorna o último valor calculado
                valorFuncao: fXCurr,
                iteracoes: iteracao,
                convergiu: false,
                erro: erro,
                motivoParada,
                passos
            };
        }

        // Fórmula do método da secante
        const xNext = ((xPrev * fXCurr) - (xCurr * fXPrev)) / (fXCurr - fXPrev);

        // Atualiza o erro e variáveis
        erro = Math.abs(xNext - xCurr);

        // Armazena os passos atuais
        passos.push({ iteracao, xPrev, xCurr, xNext, fXPrev, fXCurr, erro });

        // Atualiza as variáveis para a próxima iteração
        xPrev = xCurr;
        xCurr = xNext;

        iteracao++;
    }

    // Verifica se o método convergiu
    const convergiu = erro <= tolerancia;
    let motivoParada = convergiu ? 'Tolerância atingida' : 'Número máximo de iterações atingido';

    // A raiz encontrada é o valor atual de xCurr
    raiz = xCurr;

    // Retorna os resultados desejados
    return {
        raiz, // Sempre retorna o último valor calculado
        valorFuncao: math.evaluate(funcao, { x: raiz }),
        iteracoes: iteracao,
        convergiu,
        erro,
        motivoParada,
        passos
    };
};

module.exports = { metodoSecante };
