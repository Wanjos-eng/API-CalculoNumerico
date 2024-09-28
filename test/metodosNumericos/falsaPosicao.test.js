const { metodoFalsaPosicao } = require('../../src/metodosNumericos/falsaPosicao');

describe('Teste do método Falsa Posição', () => {
  test('Parâmetros válidos devem retornar a raiz corretamente', () => {
    const funcao = 'x^2 - 4';
    const intervalo = [0, 5];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const { resultado } = metodoFalsaPosicao(funcao, intervalo, tolerancia, maxIteracao);

    expect(resultado).toBeDefined();
    expect(resultado.convergiu).toBe(true);
    expect(resultado.raiz).toBeCloseTo(2, 3);
  });

  test('Função que não muda de sinal no intervalo deve retornar erro', () => {
    const funcao = 'x^2 - 4';
    const intervalo = [5, 10];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const { error, fa, fb } = metodoFalsaPosicao(funcao, intervalo, tolerancia, maxIteracao);

    expect(error).toBe('A função deve mudar de sinal no intervalo dado.');
    expect(fa).toBeGreaterThan(0);
    expect(fb).toBeGreaterThan(0);
  });

  test('Número máximo de iterações atingido deve ser reportado', () => {
    const funcao = 'x^3 - 2';
    const intervalo = [1, 2];
    const tolerancia = 0.0000001; // Tolerância pequena para garantir muitas iterações
    const maxIteracao = 5; // Limitar o número de iterações

    const { resultado } = metodoFalsaPosicao(funcao, intervalo, tolerancia, maxIteracao);

    expect(resultado).toBeDefined();
    expect(resultado.convergiu).toBe(false);
    expect(resultado.motivoParada).toBe('Número máximo de iterações atingido');
  });

  test('Intervalo menor que a tolerância deve parar o cálculo', () => {
    const funcao = 'x^2 - 4';
    const intervalo = [1.99, 2.01];
    const tolerancia = 0.1; // Tolerância maior que a diferença do intervalo
    const maxIteracao = 100;

    const { resultado } = metodoFalsaPosicao(funcao, intervalo, tolerancia, maxIteracao);

    expect(resultado).toBeDefined();
    expect(resultado.convergiu).toBe(true);
    expect(resultado.motivoParada).toBe('Tolerância atingida');
  });

  test('Registrar todos os passos da iteração corretamente', () => {
    const funcao = 'x^2 - 4';
    const intervalo = [0, 5];
    const tolerancia = 0.001;
    const maxIteracao = 10;

    const { resultado } = metodoFalsaPosicao(funcao, intervalo, tolerancia, maxIteracao);

    expect(resultado).toBeDefined();
    expect(resultado.passos).toBeInstanceOf(Array);
    expect(resultado.passos.length).toBeGreaterThan(0);

    // Verificando se os passos têm a estrutura correta
    resultado.passos.forEach(passo => {
      expect(passo).toHaveProperty('iteracao');
      expect(passo).toHaveProperty('intervaloAtual');
      expect(passo).toHaveProperty('pontoFalsaPosicao');
      expect(passo).toHaveProperty('valorFuncao');
      expect(passo).toHaveProperty('erro');
      expect(passo).toHaveProperty('descricao');
    });
  });
});
