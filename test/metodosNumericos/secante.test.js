const { metodoSecante } = require('../../src/metodosNumericos/secante');
const math = require('mathjs');

describe('Testes do Método da Secante', () => {
    test('Encontra raiz de uma função simples', () => {
        const funcao = 'x^2 - 4'; // Raízes em x = 2 e x = -2
        const x0 = 1;
        const x1 = 3;
        const tolerancia = 1e-6;
        const maxIteracao = 100;
        
        const resultado = metodoSecante(funcao, x0, x1, tolerancia, maxIteracao);

        expect(resultado.raiz).toBeCloseTo(2, 6); // Aproximadamente 2
        expect(resultado.iteracoes).toBeLessThanOrEqual(maxIteracao);
    });

    test('Falha se não convergir dentro do número máximo de iterações', () => {
        const funcao = 'x^3 - 2*x + 2'; // Função que não tem raiz real
        const x0 = 0;
        const x1 = 1;
        const tolerancia = 1e-6;
        const maxIteracao = 10;

        expect(() => {
            metodoSecante(funcao, x0, x1, tolerancia, maxIteracao);
        }).toThrow('O método da secante não convergiu dentro do número máximo de iterações.');
    });

    test('Erro por divisão por zero', () => {
      const funcao = '1/x'; // Exemplo de função que causa divisão por zero
      const x0 = 1;
      const x1 = 1.000001;
      const tolerancia = 1e-7;
      const maxIteracao = 100;
  
      expect(() => {
          metodoSecante(funcao, x0, x1, tolerancia, maxIteracao);
      }).toThrow('Divisão por zero detectada. Não é possível continuar o cálculo.');
  });
  

  test('Encontra raiz da função x^3 - x - 1', () => {
      const funcao = 'x^3 - x - 1'; // Raiz próxima de 1.3247
      const x0 = -1;
      const x1 = 2;
      const tolerancia = 0.002;
      const maxIteracao = 100;

      const resultado = metodoSecante(funcao, x0, x1, tolerancia, maxIteracao);

      expect(resultado.raiz).toBeCloseTo(1.331004, 1.36921);
      expect(resultado.iteracoes).toBeLessThanOrEqual(maxIteracao);
  });

  test('Encontra raiz da função e^x + x', () => {
    const funcao = 'exp(x) + x'; // Função exp(x) + x não tem raiz real, mas o método pode se aproximar de um valor
    const x0 = -1;
    const x1 = 0;
    const tolerancia = 0.05;
    const maxIteracao = 100;

    const resultado = metodoSecante(funcao, x0, x1, tolerancia, maxIteracao);

    // Mesmo que não haja raiz real exata, o método pode convergir para um valor próximo.
    // Estamos esperando que o método chegue a um valor próximo a -0.57, onde o método atinge um ponto de estabilidade
    expect(resultado.raiz).toBeCloseTo(-0.57, 1); // Verifica se está dentro de uma precisão de 1 casa decimal
    expect(resultado.iteracoes).toBeLessThanOrEqual(maxIteracao);
  });

  test('Encontra raiz da função x^4 - 2x^3 - 4x^2 + 4x + 4', () => {
      const funcao = 'x^4 - 2x^3 - 4x^2 + 4x + 4'; // Função polinomial
      const x0 = 1.3;
      const x1 = 1.5;
      const tolerancia = 0.01;
      const maxIteracao = 100;

      const resultado = metodoSecante(funcao, x0, x1, tolerancia, maxIteracao);

      expect(resultado.raiz).toBeCloseTo(1.4134, 1.5); // Aproximadamente -1.61
      expect(resultado.iteracoes).toBeLessThanOrEqual(maxIteracao);
  });

  test('Convergência lenta ou oscilação', () => {
    const funcao = 'sin(x)'; // A função senoidal tem muitas raízes e pode oscilar
    const x0 = 3;
    const x1 = 4;
    const tolerancia = 1e-6;
    const maxIteracao = 50;

    const resultado = metodoSecante(funcao, x0, x1, tolerancia, maxIteracao);
    expect(resultado.raiz).toBeCloseTo(Math.PI, 6); // Aproximadamente π
  });

  test('Raiz múltipla', () => {
    const funcao = '(x - 1)^2'; // Função com uma raiz múltipla em x = 1
    const x0 = 1;
    const x1 = 1.000001; // Valores iniciais próximos da raiz múltipla
    const tolerancia = 1e-7;
    const maxIteracao = 100;

    expect(() => {
        metodoSecante(funcao, x0, x1, tolerancia, maxIteracao);
    }).toThrow('Raiz múltipla detectada. Não é possível continuar o cálculo.');
  });
 

  test('Função com descontinuidade', () => {
    const funcao = '1 / (x - 1)'; // A função tem uma singularidade em x = 1
    const x0 = 0;
    const x1 = 2;
    const tolerancia = 1e-6;
    const maxIteracao = 100;

    expect(() => {
      metodoSecante(funcao, x0, x1, tolerancia, maxIteracao);
  }).toThrow('A função parece ter uma descontinuidade.');
  
  });

  test('Função com mudança de sinal pequena', () => {
    const funcao = '1e-8 * x^3 - x'; // A função muda de sinal rapidamente
    const x0 = -1;
    const x1 = 1;
    const tolerancia = 1e-12;
    const maxIteracao = 100;

    const resultado = metodoSecante(funcao, x0, x1, tolerancia, maxIteracao);
    expect(resultado.raiz).toBeCloseTo(0, 12); // Raiz próxima de 0
  });

  test('Função com raízes próximas', () => {
    const funcao = 'x^3 - 3*x + 2'; // Tem raízes em x = 1 e x = -2
    const x0 = 1; // Primeira raiz próxima
    const x1 = 0; // Segunda raiz próxima
    const tolerancia = 1e-7;
    const maxIteracao = 100;

    const resultado = metodoSecante(funcao, x0, x1, tolerancia, maxIteracao);
    expect(resultado.raiz).toBeCloseTo(1, 6); // Espera que a função convirja para 1
  });

  test('Aproximação inicial distante', () => {
    const funcao = 'x^2 - 4'; // Raízes em x = 2 e x = -2
    const x0 = 10; // Muito longe da raiz
    const x1 = 20;
    const tolerancia = 1e-6;
    const maxIteracao = 100;

    const resultado = metodoSecante(funcao, x0, x1, tolerancia, maxIteracao);
    expect(resultado.raiz).toBeCloseTo(2, 6); // Converge para 2
  });

  test('Encontra raiz da função f(x) = x^4 - 2x^3 - 4x^2 + 4x + 4 usando o método da secante', () => {
    const funcao = 'x^4 - 2*x^3 - 4*x^2 + 4*x + 4'; // A função dada
    const x0 = 1.3; // Primeiro ponto do intervalo
    const x1 = 1.5; // Segundo ponto do intervalo
    const tolerancia = 0.01; // Tolerância
    const maxIteracao = 100; // Número máximo de iterações

    const resultado = metodoSecante(funcao, x0, x1, tolerancia, maxIteracao);

    expect(resultado).toHaveProperty('raiz'); // Verifica se o resultado possui a propriedade 'raiz'
    expect(resultado.iteracoes).toBeLessThanOrEqual(maxIteracao); // O número de iterações não deve exceder o máximo

    // Verifica se o valor da função na raiz encontrada está dentro da tolerância
    const f = math.compile(funcao);
    const valorFuncaoNaRaiz = f.evaluate({ x: resultado.raiz });
    expect(Math.abs(valorFuncaoNaRaiz)).toBeLessThanOrEqual(tolerancia); // Checa se |f(raiz)| está dentro da tolerância
  });
});
