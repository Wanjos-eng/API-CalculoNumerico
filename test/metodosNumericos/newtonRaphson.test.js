const { metodoNewtonRaphson } = require('../../src/metodosNumericos/newtonRaphson');
const math = require('mathjs');

describe('Teste do método Newton-Raphson', () => {
  test('Convergência para função simples f(x) = x^2 - 2', () => {
    const funcao = 'x^2 - 2';
    const chuteInicial = 1;
    const tolerancia = 1e-6;
    const maxIteracao = 100;

    const resultadoMetodo = metodoNewtonRaphson(funcao, chuteInicial, tolerancia, maxIteracao);

    expect(resultadoMetodo).toHaveProperty('resultado');
    const resultado = resultadoMetodo.resultado;
    expect(resultado.convergiu).toBe(true);
    expect(resultado.raiz).toBeCloseTo(math.sqrt(2), 6);
    expect(resultado.motivoParada).toBe('Tolerância atingida');
  });

  test('Convergência imediata quando f(x0) = 0 (chute inicial é a raiz)', () => {
    const funcao = 'x^3';
    const chuteInicial = 0;
    const tolerancia = 1e-6;
    const maxIteracao = 100;

    const resultadoMetodo = metodoNewtonRaphson(funcao, chuteInicial, tolerancia, maxIteracao);

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
    const chuteInicial = math.pi / 2; // cos(π/2) = 0
    const tolerancia = 1e-6;
    const maxIteracao = 100;

    const resultadoMetodo = metodoNewtonRaphson(funcao, chuteInicial, tolerancia, maxIteracao);

    expect(resultadoMetodo).toHaveProperty('error');
    expect(resultadoMetodo.error).toBe('Derivada próxima de zero. Método falhou.');
    expect(resultadoMetodo.iteracao).toBe(0);
    expect(resultadoMetodo.xAtual).toBeCloseTo(chuteInicial, 10);
    expect(Math.abs(resultadoMetodo.valorFuncao)).toBeGreaterThan(tolerancia);
  });

  test('Convergência ou falha quando derivada se torna próxima de zero durante as iterações', () => {
    const funcao = 'x^3';
    const chuteInicial = 0.001;
    const tolerancia = 1e-6;
    const maxIteracao = 100;

    const resultadoMetodo = metodoNewtonRaphson(funcao, chuteInicial, tolerancia, maxIteracao);

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
    const chuteInicial = -5; // Escolhido para aumentar as iterações
    const tolerancia = 1e-15; // Tolerância muito pequena
    const maxIteracao = 5; // Número baixo de iterações

    const resultadoMetodo = metodoNewtonRaphson(funcao, chuteInicial, tolerancia, maxIteracao);

    expect(resultadoMetodo).toHaveProperty('resultado');
    const resultado = resultadoMetodo.resultado;
    expect(resultado.convergiu).toBe(false);
    expect(resultado.iteracoes).toBe(maxIteracao);
    expect(resultado.motivoParada).toBe('Número máximo de iterações atingido');
  });

  test('Convergência para função com múltiplas raízes f(x) = x^3 - x', () => {
    const funcao = 'x^3 - x';
    const chuteInicial = 0.5;
    const tolerancia = 1e-6;
    const maxIteracao = 100;

    const resultadoMetodo = metodoNewtonRaphson(funcao, chuteInicial, tolerancia, maxIteracao);

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

  test('Deve encontrar a raiz para f(x) = x * log(x) - 1 no intervalo [2, 3]', () => {
    const funcao = 'x * log(x,10) - 1';
    const chuteInicial = 2.5; // Chute inicial no intervalo [2, 3]
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoNewtonRaphson(funcao, chuteInicial, tolerancia, maxIteracao);
    //console.log(resultado); // Para depuração

    if (resultado.error) {
        throw new Error(resultado.error);
    }

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.motivoParada).toBe('Tolerância atingida');
  });

  test('Deve encontrar a raiz para f(x) = x^3 - x - 1 no intervalo [1, 2]', () => {
    const funcao = 'x^3 - x - 1';
    const chuteInicial = 1.5; // Chute inicial no intervalo [1, 2]
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoNewtonRaphson(funcao, chuteInicial, tolerancia, maxIteracao);
    //console.log(resultado); // Para depuração

    if (resultado.error) {
        throw new Error(resultado.error);
    }

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.motivoParada).toBe('Tolerância atingida');
  });

  test('Deve encontrar a raiz para f(x) = e^x + x no intervalo [-1, 0]', () => {
    const funcao = 'exp(x) + x';
    const chuteInicial = -0.5; // Chute inicial no intervalo [-1, 0]
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoNewtonRaphson(funcao, chuteInicial, tolerancia, maxIteracao);
    //console.log(resultado); // Para depuração

    if (resultado.error) {
        throw new Error(resultado.error);
    }

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.motivoParada).toBe('Tolerância atingida');
  }); 

  test('Falha em caso de chute inicial distante da raiz', () => {
    const funcao = 'x^3 - 2*x + 2'; // Raízes complexas
    const chuteInicial = 1000; // Chute inicial distante
    const tolerancia = 1e-6;
    const maxIteracao = 100;

    const resultadoMetodo = metodoNewtonRaphson(funcao, chuteInicial, tolerancia, maxIteracao);
    
    // Verifica se um erro é retornado
    expect(resultadoMetodo).toHaveProperty('error');
    expect(resultadoMetodo.error).toBe('Chute inicial muito longe da raiz.');
  });

  test('Validação dos parâmetros', () => {
    const funcao = 'x^2 - 4';
    const chuteInicial = 2;
    const tolerancia = 1e-6;
    const maxIteracao = 100;

    // Parâmetros inválidos
    expect(() => metodoNewtonRaphson(null, chuteInicial, tolerancia, maxIteracao)).toThrow();
    expect(() => metodoNewtonRaphson(funcao, null, tolerancia, maxIteracao)).toThrow();
    expect(() => metodoNewtonRaphson(funcao, chuteInicial, -1, maxIteracao)).toThrow(); // tolerância negativa
    expect(() => metodoNewtonRaphson(funcao, chuteInicial, tolerancia, -1)).toThrow(); // maxIteração negativa
  });

  test('Comportamento em funções oscilatórias', () => {
    const funcao = 'sin(x)'; // Função oscilatória
    const chuteInicial = 3; // Um chute inicial que não é a raiz
    const tolerancia = 1e-6;
    const maxIteracao = 100;

    const resultadoMetodo = metodoNewtonRaphson(funcao, chuteInicial, tolerancia, maxIteracao);

    expect(resultadoMetodo).toHaveProperty('resultado');
    const resultado = resultadoMetodo.resultado;

    // Como sin(x) tem múltiplas raízes, o chute inicial pode ou não convergir.
    // Verifica se o método não falhou devido a derivadas próximas de zero
    expect(resultado.iteracoes).toBeLessThanOrEqual(maxIteracao);
    expect(resultado.motivoParada).toMatch(/Tolerância atingida|Número máximo de iterações atingido/);
  });

  test('Convergência para a função f(x) = x^4 - 2x^3 - 4x^2 + 4x + 4', () => {
    const funcao = 'x^4 - 2*x^3 - 4*x^2 + 4*x + 4';
    const chuteInicial = 1.3; // Chute inicial
    const tolerancia = 0.01; // Tolerância
    const maxIteracao = 100; // Número máximo de iterações

    const resultadoMetodo = metodoNewtonRaphson(funcao, chuteInicial, tolerancia, maxIteracao);

    expect(resultadoMetodo).toHaveProperty('resultado');
    const resultado = resultadoMetodo.resultado;

    // Verifica se a raiz foi encontrada com a tolerância especificada
    expect(resultado.convergiu).toBe(true);
    expect(Math.abs(resultado.valorFuncao)).toBeLessThan(tolerancia); // f(x) deve ser menor que a tolerância
    expect(resultado.iteracoes).toBeLessThanOrEqual(maxIteracao); // O número de iterações não deve exceder o máximo
    expect(resultado.motivoParada).toBe('Tolerância atingida'); // O motivo da parada deve ser a tolerância atingida
  });
  
  test('Função cuja derivada não pode ser calculada deve lançar erro', () => {
    const funcao = 'max(x, 0)'; // Função cuja derivada não pode ser calculada pelo mathjs
    const chuteInicial = 1;
    const tolerancia = 0.001;
    const maxIteracao = 100;
  
    const resultadoMetodo = metodoNewtonRaphson(funcao, chuteInicial, tolerancia, maxIteracao);
  
    expect(resultadoMetodo).toHaveProperty('error');
    expect(resultadoMetodo.error).toBe('Não foi possível calcular a derivada da função.');
    expect(resultadoMetodo.iteracao).toBe(0);
    expect(resultadoMetodo.xAtual).toBe(chuteInicial);
    expect(resultadoMetodo.valorFuncao).toBeNull();
  });    
});
