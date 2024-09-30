// test/metodosNumericos/bisseccao.test.js
const { metodoBisseccao } = require('../../src/metodosNumericos/bisseccao');

describe('Método da Bissecção', () => {
  // Caso de Teste 1: Raiz no Intervalo
  test('Deve encontrar a raiz da função f(x) = x^2 - 4 no intervalo [0, 5]', () => {
    const funcao = 'x^2 - 4';
    const intervalo = [0, 5];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);
    
    if (resultado.error) {
        throw new Error(resultado.error);
    }

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.raiz).toBeCloseTo(2, 3);
    expect(resultado.resultado.motivoParada).toBe('Tolerância atingida');
  });

  // Caso de Teste 2: Raiz no Endpoint (f(a) = 0)
  test('Deve identificar a raiz no endpoint a = 1 para a função f(x) = x - 1 no intervalo [1, 2]', () => {
    const funcao = 'x - 1';
    const intervalo = [1, 2];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);
    //console.log(resultado); // Para depuração

    if (resultado.error) {
      throw new Error(resultado.error);
    }

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.raiz).toBeCloseTo(1, 3);
    expect(resultado.resultado.motivoParada).toBe('Raiz encontrada no extremo do intervalo');
  });

  // Caso de Teste 3: Função Sem Raiz no Intervalo (f(a) * f(b) > 0)
  test('Deve retornar erro quando a função f(x) = x^2 + 1 não muda de sinal no intervalo [0, 2]', () => {
    const funcao = 'x^2 + 1';
    const intervalo = [0, 2];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    expect(() => {
        metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);
    }).toThrow('A função deve mudar de sinal no intervalo dado.');
  });


  // Caso de Teste 4: Máximo de Iterações Atingido sem Convergência
  test('Deve parar após o número máximo de iterações sem convergir para a função f(x) = cos(x) - x no intervalo [0, 1] com tolerância 1e-10 e maxIteracao 5', () => {
    const funcao = 'cos(x) - x';
    const intervalo = [0, 1];
    const tolerancia = 1e-10;
    const maxIteracao = 5;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);
    //console.log(resultado); // Para depuração

    if (resultado.error) {
      throw new Error(resultado.error);
    }

    expect(resultado.resultado.convergiu).toBe(false);
    expect(resultado.resultado.iteracoes).toBe(maxIteracao);
    expect(resultado.resultado.motivoParada).toBe('Número máximo de iterações atingido');
  });

  // Caso de Teste 5: Função com Múltiplas Raízes no Intervalo
  test('Deve encontrar uma das raízes da função f(x) = x^3 - 3*x + 2 no intervalo [-3, 0]', () => {
    const funcao = 'x^3 - 3*x + 2';
    const intervalo = [-3, 0];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);
    //console.log(resultado); // Para depuração

    if (resultado.error) {
      throw new Error(resultado.error);
    }

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.raiz).toBeCloseTo(-2, 3);
    expect(resultado.resultado.motivoParada).toBe('Tolerância atingida');
  });

  // Caso de Teste 6: Intervalo de Tamanho Zero com Raiz no Extremo
  test('Deve identificar a raiz no extremo do intervalo quando o intervalo tem tamanho zero para a função f(x) = x - 1 no intervalo [1, 1]', () => {
    const funcao = 'x - 1';
    const intervalo = [1, 1];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);
    //console.log(resultado); // Para depuração

    if (resultado.error) {
      throw new Error(resultado.error);
    }

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.raiz).toBeCloseTo(1, 3);
    expect(resultado.resultado.motivoParada).toBe('Raiz encontrada no extremo do intervalo');
  });

  // Caso de Teste 7: Função Linear com Raiz no Meio do Intervalo
  test('Deve encontrar a raiz da função f(x) = x - 3 no intervalo [2, 4]', () => {
    const funcao = 'x - 3';
    const intervalo = [2, 4];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);
    //console.log(resultado); // Para depuração

    if (resultado.error) {
      throw new Error(resultado.error);
    }

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.raiz).toBeCloseTo(3, 3);
    expect(resultado.resultado.motivoParada).toBe('Tolerância atingida');
  });

  // Caso de Teste 8: Raiz no Endpoint (f(b) = 0)
  test('Deve identificar a raiz no endpoint b = 2 para a função f(x) = x - 2 no intervalo [1, 2]', () => {
    const funcao = 'x - 2';
    const intervalo = [1, 2];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);
    //console.log(resultado); // Para depuração

    if (resultado.error) {
      throw new Error(resultado.error);
    }

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.raiz).toBeCloseTo(2, 3);
    expect(resultado.resultado.motivoParada).toBe('Raiz encontrada no extremo do intervalo');
  });

  test('Deve encontrar a raiz para f(x) = x * log(x) - 1 no intervalo [2, 3]', () => {
    const funcao = 'x * log(x,10)-1';
    const intervalo = [2, 3];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);
    //console.log(resultado); // Para depuração

    if (resultado.error) {
        throw new Error(resultado.error);
    }

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.motivoParada).toBe('Tolerância atingida'); // Ou 'Raiz encontrada no extremo do intervalo' se apropriado
});

test('Deve encontrar a raiz para f(x) = x^3 - x - 1 no intervalo [1, 2]', () => {
    const funcao = 'x^3 - x - 1';
    const intervalo = [1, 2];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);
    //console.log(resultado); // Para depuração

    if (resultado.error) {
        throw new Error(resultado.error);
    }

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.motivoParada).toBe('Tolerância atingida'); // Ou 'Raiz encontrada no extremo do intervalo' se apropriado
});

test('Deve encontrar a raiz para f(x) = e^x + x no intervalo [-1, 0]', () => {
    const funcao = 'exp(x) + x';
    const intervalo = [-1, 0];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);
    //console.log(resultado); // Para depuração

    if (resultado.error) {
        throw new Error(resultado.error);
    }

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.motivoParada).toBe('Tolerância atingida'); // Ou 'Raiz encontrada no extremo do intervalo' se apropriado
  });

  test('Deve lançar erro ao encontrar uma descontinuidade no intervalo [-1, 1]', () => {
    const funcao = '1/x'; // Descontinuidade em x = 0
    const intervalo = [-1, 1];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    expect(() => {
        metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);
    }).toThrow('A função parece ter uma descontinuidade no intervalo fornecido.');
  });

  test('Deve encontrar a raiz da função x^3 - x no intervalo [0.5, 1.5]', () => {
    const funcao = 'x^3 - x';
    const intervalo = [0.5, 1.5];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);

    if (resultado.error) {
        throw new Error(resultado.error);
    }

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.raiz).toBeCloseTo(1, 3);
    expect(resultado.resultado.motivoParada).toBe('Tolerância atingida');
  });

  test('Deve encontrar a raiz da função f(x) = x^4 - 2*x^3 - 4*x^2 + 4*x + 4 no intervalo [1.3, 1.5]', () => {
    const funcao = 'x^4 - 2*x^3 - 4*x^2 + 4*x + 4'; // A função dada
    const intervalo = [1.3, 1.5]; // Intervalo para buscar a raiz
    const tolerancia = 0.01; // Tolerância
    const maxIteracao = 100; // Número máximo de iterações

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);
    
    if (resultado.error) {
        throw new Error(resultado.error);
    }

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.motivoParada).toBe('Tolerância atingida');
    expect(resultado.resultado.raiz).toBeCloseTo(1.414, 2); // Raiz aproximada entre 1.3 e 1.5
  });
});
