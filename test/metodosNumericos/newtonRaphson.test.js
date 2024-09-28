const { metodoNewtonRaphson } = require('../../src/metodosNumericos/newtonRaphson');
const math = require('mathjs');

describe('Teste do método Newton-Raphson', () => {
  test('Convergência para função simples f(x) = x^2 - 2', () => {
    const funcao = 'x^2 - 2';
    const derivada = '2 * x';
    const chuteInicial = 1;
    const tolerancia = 1e-6;
    const maxIteracao = 100;

    const resultadoMetodo = metodoNewtonRaphson(funcao, derivada, chuteInicial, tolerancia, maxIteracao);

    expect(resultadoMetodo).toHaveProperty('resultado');
    const resultado = resultadoMetodo.resultado;
    expect(resultado.convergiu).toBe(true);
    expect(resultado.raiz).toBeCloseTo(math.sqrt(2), 6);
    expect(resultado.motivoParada).toBe('Tolerância atingida');
  });

  test('Convergência imediata quando f(x0) = 0 (chute inicial é a raiz)', () => {
    const funcao = 'x^3';
    const derivada = '3 * x^2';
    const chuteInicial = 0;
    const tolerancia = 1e-6;
    const maxIteracao = 100;

    const resultadoMetodo = metodoNewtonRaphson(funcao, derivada, chuteInicial, tolerancia, maxIteracao);

    expect(resultadoMetodo).toHaveProperty('resultado');
    const resultado = resultadoMetodo.resultado;
    expect(resultado.convergiu).toBe(true);
    expect(resultado.iteracoes).toBe(0);
    expect(resultado.raiz).toBeCloseTo(chuteInicial, 10);
    expect(resultado.valorFuncao).toBeCloseTo(0, 10);
    expect(resultado.motivoParada).toBe('Tolerância atingida');
  });

  test('Falha quando derivada é zero no chute inicial com f(x0) ≠ 0', () => {
    const funcao = 'sin(x)';
    const derivada = 'cos(x)';
    const chuteInicial = math.pi / 2; // cos(π/2) = 0
    const tolerancia = 1e-6;
    const maxIteracao = 100;

    const resultadoMetodo = metodoNewtonRaphson(funcao, derivada, chuteInicial, tolerancia, maxIteracao);

    expect(resultadoMetodo).toHaveProperty('error');
    expect(resultadoMetodo.error).toBe('Derivada próxima de zero. Método falhou.');
    expect(resultadoMetodo.iteracao).toBe(0);
    expect(resultadoMetodo.xAtual).toBeCloseTo(chuteInicial, 10);
    expect(Math.abs(resultadoMetodo.valorFuncao)).toBeGreaterThan(tolerancia);
  });

  test('Convergência ou falha quando derivada se torna próxima de zero durante as iterações', () => {
    const funcao = 'x^3';
    const derivada = '3 * x^2';
    const chuteInicial = 0.001;
    const tolerancia = 1e-6;
    const maxIteracao = 100;

    const resultadoMetodo = metodoNewtonRaphson(funcao, derivada, chuteInicial, tolerancia, maxIteracao);

    // Verificar se o método convergiu ou se falhou devido à derivada próxima de zero
    if (resultadoMetodo.error) {
      expect(resultadoMetodo.error).toBe('Derivada próxima de zero. Método falhou.');
    } else {
      expect(resultadoMetodo).toHaveProperty('resultado');
      const resultado = resultadoMetodo.resultado;
      expect(resultado.convergiu).toBe(true);
      expect(resultado.erro).toBeLessThanOrEqual(tolerancia);
    }
  });

  test('Máximo de iterações atingido sem convergência', () => {
    const funcao = 'exp(x) - 2'; // Função que cresce rapidamente
    const derivada = 'exp(x)';
    const chuteInicial = -5; // Escolhido para aumentar as iterações
    const tolerancia = 1e-15; // Tolerância muito pequena
    const maxIteracao = 5; // Número baixo de iterações

    const resultadoMetodo = metodoNewtonRaphson(funcao, derivada, chuteInicial, tolerancia, maxIteracao);

    expect(resultadoMetodo).toHaveProperty('resultado');
    const resultado = resultadoMetodo.resultado;
    expect(resultado.convergiu).toBe(false);
    expect(resultado.iteracoes).toBe(maxIteracao);
    expect(resultado.motivoParada).toBe('Número máximo de iterações atingido');
  });

  test('Convergência para função com múltiplas raízes f(x) = x^3 - x', () => {
    const funcao = 'x^3 - x';
    const derivada = '3 * x^2 - 1';
    const chuteInicial = 0.5;
    const tolerancia = 1e-6;
    const maxIteracao = 100;

    const resultadoMetodo = metodoNewtonRaphson(funcao, derivada, chuteInicial, tolerancia, maxIteracao);

    expect(resultadoMetodo).toHaveProperty('resultado');
    const resultado = resultadoMetodo.resultado;
    expect(resultado.convergiu).toBe(true);

    // Verifica se a raiz encontrada é próxima de uma das raízes conhecidas (-1, 0, 1)
    const raizesEsperadas = [-1, 0, 1];
    const raizEncontrada = resultado.raiz;
    const raizProxima = raizesEsperadas.find((r) => Math.abs(raizEncontrada - r) < tolerancia);

    expect(raizProxima).not.toBeUndefined();
    expect(resultado.motivoParada).toBe('Tolerância atingida');
  });
});
