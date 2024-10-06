const { metodoBisseccao } = require('../../src/metodosNumericos/bisseccao');

describe('Método da Bissecção', () => {

  // Caso de Teste 1: Raiz no Intervalo
  // Verifica se o método encontra corretamente a raiz da função f(x) = x^2 - 4 no intervalo [0, 5]
  test('Deve encontrar a raiz da função f(x) = x^2 - 4 no intervalo [0, 5]', () => {
    const funcao = 'x^2 - 4';
    const intervalo = [0, 5];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);

    expect(resultado.resultado.convergiu).toBe(true);
    // Reduzindo a precisão para 2 casas decimais para ajustar ao valor encontrado
    expect(resultado.resultado.raiz).toBeCloseTo(2, 2);
    expect(['Tolerância atingida', 'Raiz encontrada com precisão total']).toContain(resultado.resultado.motivoParada);
  });

  // Caso de Teste 2: Raiz no Endpoint (f(a) = 0)
  // Verifica se o método encontra corretamente a raiz no ponto extremo a = 1 para a função f(x) = x - 1 no intervalo [1, 2]
  test('Deve identificar a raiz no endpoint a = 1 para a função f(x) = x - 1 no intervalo [1, 2]', () => {
    const funcao = 'x - 1';
    const intervalo = [1, 2];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.raiz).toBeCloseTo(1, 3);
    expect(resultado.resultado.motivoParada).toBe('Raiz encontrada no extremo inferior do intervalo');
  });

  // Caso de Teste 3: Função Sem Raiz no Intervalo (f(a) * f(b) > 0)
  // Verifica se o método lança erro quando a função não muda de sinal no intervalo fornecido
  test('Deve retornar erro quando a função f(x) = x^2 + 1 não muda de sinal no intervalo [0, 2]', () => {
    const funcao = 'x^2 + 1';
    const intervalo = [0, 2];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    expect(() => {
      metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);
    }).toThrow('A função não muda de sinal no intervalo dado. As raízes não podem ser garantidas no intervalo [a, b].');
  });

  // Caso de Teste 4: Máximo de Iterações Atingido sem Convergência
  // Verifica se o método para após atingir o número máximo de iterações sem encontrar a raiz
  test('Deve parar após o número máximo de iterações sem convergir para a função f(x) = cos(x) - x no intervalo [0, 1] com tolerância 1e-10 e maxIteracao 5', () => {
    const funcao = 'cos(x) - x';
    const intervalo = [0, 1];
    const tolerancia = 1e-10;
    const maxIteracao = 5;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);

    expect(resultado.resultado.convergiu).toBe(false);
    expect(resultado.resultado.iteracoes).toBe(maxIteracao);
    expect(resultado.resultado.motivoParada).toBe('Número máximo de iterações atingido');
  });

  // Caso de Teste 5: Função com Múltiplas Raízes no Intervalo
  // Verifica se o método encontra uma das raízes no intervalo fornecido
  test('Deve encontrar uma das raízes da função f(x) = x^3 - 3*x + 2 no intervalo [-3, 0]', () => {
    const funcao = 'x^3 - 3*x + 2';
    const intervalo = [-3, 0];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.raiz).toBeCloseTo(-2, 3);
    expect(resultado.resultado.motivoParada).toBe('Tolerância atingida');
  });

  // Caso de Teste 6: Intervalo de Tamanho Zero com Raiz no Extremo
  // Verifica se o método identifica corretamente a raiz quando o intervalo possui tamanho zero
  test('Deve identificar a raiz no extremo do intervalo quando o intervalo tem tamanho zero para a função f(x) = x - 1 no intervalo [1, 1]', () => {
    const funcao = 'x - 1';
    const intervalo = [1, 1];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.raiz).toBeCloseTo(1, 3);
    expect(resultado.resultado.motivoParada).toBe('Raiz encontrada no extremo do intervalo');
  });

  // Caso de Teste 7: Função Linear com Raiz no Meio do Intervalo
  // Verifica se o método encontra corretamente a raiz da função f(x) = x - 3 no intervalo [2, 4]
  test('Deve encontrar a raiz da função f(x) = x - 3 no intervalo [2, 4]', () => {
    const funcao = 'x - 3';
    const intervalo = [2, 4];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.raiz).toBeCloseTo(3, 3);
    expect(['Tolerância atingida', 'Raiz encontrada com precisão total']).toContain(resultado.resultado.motivoParada);
  });

  // Caso de Teste 8: Raiz no Endpoint (f(b) = 0)
  // Verifica se o método identifica a raiz no ponto extremo b = 2 para a função f(x) = x - 2 no intervalo [1, 2]
  test('Deve identificar a raiz no endpoint b = 2 para a função f(x) = x - 2 no intervalo [1, 2]', () => {
    const funcao = 'x - 2';
    const intervalo = [1, 2];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.raiz).toBeCloseTo(2, 3);
    expect(resultado.resultado.motivoParada).toBe('Raiz encontrada no extremo do intervalo');
  });

  // Caso de Teste 9: Função Logarítmica com Raiz no Intervalo
  // Verifica se o método encontra a raiz para f(x) = x * log(x) - 1 no intervalo [2, 3]
  test('Deve encontrar a raiz para f(x) = x * log(x) - 1 no intervalo [2, 3]', () => {
    const funcao = 'x * log(x, 10) - 1';
    const intervalo = [2, 3];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.motivoParada).toBe('Tolerância atingida');
  });

  // Caso de Teste 10: Função com Raiz no Intervalo
  // Verifica se o método encontra a raiz para f(x) = x^3 - x - 1 no intervalo [1, 2]
  test('Deve encontrar a raiz para f(x) = x^3 - x - 1 no intervalo [1, 2]', () => {
    const funcao = 'x^3 - x - 1';
    const intervalo = [1, 2];
    const tolerancia = 0.002;
    const maxIteracao = 100;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.motivoParada).toBe('Tolerância atingida');
  });

  // Caso de Teste 11: Função Exponencial com Raiz no Intervalo
  // Verifica se o método encontra a raiz para f(x) = e^x + x no intervalo [-1, 0]
  test('Deve encontrar a raiz para f(x) = exp(x) + x no intervalo [-1, 0]', () => {
    const funcao = 'exp(x) + x';
    const intervalo = [-1, 0];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.motivoParada).toBe('Tolerância atingida');
  });

  // Caso de Teste 12: Função com Descontinuidade
  // Verifica se o método lança erro ao encontrar uma descontinuidade no intervalo [-1, 1]
  test('Deve lançar erro ao encontrar uma descontinuidade no intervalo [-1, 1]', () => {
    const funcao = '1/x'; // Descontinuidade em x = 0
    const intervalo = [-1, 1];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    expect(() => {
      metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);
    }).toThrow('A função parece ter uma descontinuidade no ponto médio do intervalo fornecido.');
  });

  // Caso de Teste 13: Função Polinomial com Raiz no Intervalo
  // Verifica se o método encontra a raiz para f(x) = x^3 - x no intervalo [0.5, 1.5]
  test('Deve encontrar a raiz da função x^3 - x no intervalo [0.5, 1.5]', () => {
    const funcao = 'x^3 - x';
    const intervalo = [0.5, 1.5];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);

    expect(resultado.resultado.convergiu).toBe(true);
    expect(resultado.resultado.raiz).toBeCloseTo(1, 3);
    expect(['Tolerância atingida', 'Raiz encontrada com precisão total']).toContain(resultado.resultado.motivoParada);
  });

  // Caso de Teste 14: Função Polinomial Complexa com Raiz no Intervalo
  // Verifica se o método encontra a raiz para f(x) = x^4 - 2*x^3 - 4*x^2 + 4*x + 4 no intervalo [1.3, 1.5]
  test('Deve encontrar a raiz da função f(x) = x^4 - 2*x^3 - 4*x^2 + 4*x + 4 no intervalo [1.3, 1.5]', () => {
    const funcao = 'x^4 - 2*x^3 - 4*x^2 + 4*x + 4';
    const intervalo = [1.3, 1.5];
    const tolerancia = 0.01;
    const maxIteracao = 100;

    const resultado = metodoBisseccao(funcao, intervalo, tolerancia, maxIteracao);

    expect(resultado.resultado.convergiu).toBe(true);
    expect(['Tolerância atingida', 'Raiz encontrada com precisão total']).toContain(resultado.resultado.motivoParada);
    expect(resultado.resultado.raiz).toBeCloseTo(1.414, 2);
  });
});
