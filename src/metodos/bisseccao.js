const math = require('mathjs');

// Método de Bissecção com passo a passo detalhado
const metodoBisseccao = (funcao, intervalo, tolerancia, maxIteracao) => {
  const f = math.compile(funcao);  // Compila a função matemática
  let [a, b] = intervalo;  // Define os extremos do intervalo
  let fa = f.evaluate({ x: a });  // Avalia f(a)
  let fb = f.evaluate({ x: b });  // Avalia f(b)

  if (fa * fb >= 0) {
    return { error: 'A função deve mudar de sinal no intervalo dado.' };
  }

  let passos = [];  // Armazena os detalhes de cada iteração
  let iteracao = 0;
  let c, fc;

  // Loop até atingir o máximo de iterações ou a tolerância desejada
  while (iteracao < maxIteracao) {
    // Cálculo do ponto médio
    c = (a + b) / 2;
    fc = f.evaluate({ x: c });  // Avalia f(c)

    // Armazena os detalhes da iteração atual
    passos.push({
      iteracao: iteracao + 1,
      descricaoPasso: `
        Iteração ${iteracao + 1}:
        a = ${a}, b = ${b}
        c (ponto médio) = (a + b) / 2 = (${a} + ${b}) / 2 = ${c}
        fa = f(${a}) = ${fa}
        fb = f(${b}) = ${fb}
        fc = f(${c}) = ${fc}
        Erro = |fc| = ${Math.abs(fc)}
      `,
      a: a,
      b: b,
      c: c,
      fa: fa,
      fb: fb,
      fc: fc,
      erro: Math.abs(fc)
    });

    // Critério de parada baseado na tolerância
    if (Math.abs(fc) < tolerancia) {
      break;
    }

    // Atualiza os valores de a ou b com base no sinal de fc
    if (fa * fc < 0) {
      b = c;
      fb = fc;
    } else {
      a = c;
      fa = fc;
    }

    iteracao++;
  }

  // Retorna o resultado final: a raiz, número de iterações e o histórico de passos
  return { raiz: c, iteracoes: iteracao, passos: passos };
};

module.exports = { metodoBisseccao };
