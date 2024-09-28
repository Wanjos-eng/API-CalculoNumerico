const { metodoSecante } = require('../../src/metodosNumericos/secante');

describe('Teste do método Secante', () => {
  test('Convergência para função simples f(x) = x^2 - 4', () => {
    const funcao = 'x^2 - 4';
    const x0 = 1;
    const x1 = 3;
    const tolerancia = 1e-6;
    const maxIteracao = 100;

    const resultadoMetodo = metodoSecante(funcao, x0, x1, tolerancia, maxIteracao);

    expect(resultadoMetodo).toHaveProperty('resultado');
    const resultado = resultadoMetodo.resultado;
    expect(resultado.convergiu).toBe(true);
    expect(resultado.raiz).toBeCloseTo(2, 6);
    expect(resultado.motivoParada).toBe('Tolerância atingida');
  });

  test('Erro devido a divisão por zero quando f(x0) = f(x1)', () => {
    const funcao = 'x^3 - x^2'; // Esta função tem uma derivada nula para x0 e x1 iguais
    const x0 = 1;
    const x1 = 1; // Ambos chutes são exatamente iguais para garantir que f(x0) = f(x1)
    const tolerancia = 1e-6;
    const maxIteracao = 100;

    const resultadoMetodo = metodoSecante(funcao, x0, x1, tolerancia, maxIteracao);

    expect(resultadoMetodo).toHaveProperty('error');
    expect(resultadoMetodo.error).toBe('Divisão por zero, a função não deve ser constante no intervalo.');
  });

  test('Máximo de iterações atingido sem convergência', () => {
    const funcao = 'x^2 - 2'; // Função escolhida para não convergir rapidamente com os valores iniciais
    const x0 = 1;
    const x1 = 2; // Valores iniciais que não convergem rapidamente
    const tolerancia = 1e-6;
    const maxIteracao = 3; // Número de iterações reduzido para atingir o limite

    const resultadoMetodo = metodoSecante(funcao, x0, x1, tolerancia, maxIteracao);

    expect(resultadoMetodo).toHaveProperty('resultado');
    const resultado = resultadoMetodo.resultado;
    expect(resultado.convergiu).toBe(false);
    expect(resultado.iteracoes).toBe(maxIteracao); // Espera 3 iterações
    expect(resultado.motivoParada).toBe('Número máximo de iterações atingido');
  });

  test('Convergência para função com múltiplas raízes f(x) = x^3 - 3x + 2', () => {
    const funcao = 'x^3 - 3 * x + 2';
    const x0 = -3; // Escolhendo um valor inicial que converge para uma raiz específica
    const x1 = -1.5; // Ajustando para evitar divisão por zero
    const tolerancia = 1e-6;
    const maxIteracao = 100;

    const resultadoMetodo = metodoSecante(funcao, x0, x1, tolerancia, maxIteracao);

    if (resultadoMetodo.error) {
      throw new Error('O método não deveria falhar devido a divisão por zero.');
    } else {
      expect(resultadoMetodo).toHaveProperty('resultado');
      const resultado = resultadoMetodo.resultado;
      expect(resultado.convergiu).toBe(true);
      
      const raizEncontrada = resultado.raiz;
      const raizesEsperadas = [1, -2];
      const encontrouRaizEsperada = raizesEsperadas.some((raiz) =>
        Math.abs(raiz - raizEncontrada) < tolerancia
      );
      expect(encontrouRaizEsperada).toBe(true);
      
      expect(resultado.motivoParada).toBe('Tolerância atingida');
    }
  });
});
