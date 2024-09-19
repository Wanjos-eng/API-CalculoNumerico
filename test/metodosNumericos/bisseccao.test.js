// test/metodosNumericos/bisseccao.test.js
const { metodoBisseccao } = require('../../src/metodosNumericos/bisseccao');

describe('Método da Bissecção', () => {
  test('Deve encontrar a raiz da função x^2 - 4 no intervalo [0, 5]', () => {
    const funcao = 'x^2 - 4';
    const intervalo = [0, 5];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);
    console.log(resultado); // Para depuração

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.raiz).toBeCloseTo(2, 3);
  });
});
