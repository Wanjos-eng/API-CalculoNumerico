const { metodoFalsaPosicao } = require('../../src/metodosNumericos/falsaPosicao');
const { validarParametros } = require('../../src/services/validacaoParametros');
const math = require('mathjs'); // Adicione esta linha

// Mock para validarParametros
jest.mock('../../src/services/validacaoParametros', () => ({
  validarParametros: jest.fn(),
}));

describe('metodoFalsaPosicao', () => {
  beforeEach(() => {
    validarParametros.mockClear();
  });

  it('deve encontrar a raiz da função f(x) = x^2 - 4 no intervalo [0, 3] com tolerância 0.001', () => {
    const funcao = 'x^2 - 4';
    const intervalo = [0, 3];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoFalsaPosicao(funcao, intervalo, tolerancia, maxIteracao);
    
    expect(resultado.raiz).toBeCloseTo(2, 3);
    expect(resultado.iteracoes).toBeLessThan(maxIteracao);
    expect(resultado.erro).toBeLessThan(tolerancia);
  });

  it('deve lançar erro se f(a) e f(b) tiverem o mesmo sinal', () => {
    const funcao = 'x^2 - 4';
    const intervalo = [3, 4];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    expect(() => metodoFalsaPosicao(funcao, intervalo, tolerancia, maxIteracao))
      .toThrow('Não há raiz no intervalo fornecido, f(a) e f(b) devem ter sinais opostos, a função deve mudar de sinal no intervalo dado.');
  });

  it('deve lançar erro se o número máximo de iterações for atingido sem convergência', () => {
    const funcao = 'x^3 - 2*x + 2'; // Função difícil de convergir neste intervalo específico
    const intervalo = [-2, 2];
    const tolerancia = 1e-10; // Tolerância muito pequena para forçar não convergência
    const maxIteracao = 5; // Limite baixo de iterações

    expect(() => metodoFalsaPosicao(funcao, intervalo, tolerancia, maxIteracao))
      .toThrow('Número máximo de iterações atingido sem convergência.');
  });

  it('deve chamar validarParametros com os argumentos corretos', () => {
    const funcao = 'x^2 - 4';
    const intervalo = [0, 3];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    metodoFalsaPosicao(funcao, intervalo, tolerancia, maxIteracao);

    expect(validarParametros).toHaveBeenCalledWith('falsaPosicao', { funcao, intervalo, tolerancia, maxIteracao });
  });
  
  it('deve encontrar a raiz da função f(x) = x^3 - x - 2 no intervalo [1, 2] com tolerância 0.001', () => {
    const funcao = 'x^3 - x - 2';
    const intervalo = [1, 2];
    const tolerancia = 0.001;
    const maxIteracao = 100;
  
    const resultado = metodoFalsaPosicao(funcao, intervalo, tolerancia, maxIteracao);
    
    // Verificando se a raiz está próxima de 1.521, dentro da tolerância
    expect(resultado.raiz).toBeCloseTo(1.521, 3);
    expect(resultado.iteracoes).toBeLessThan(maxIteracao);
    expect(resultado.erro).toBeLessThan(tolerancia);
  });
  
  it('deve lançar erro se não houver raiz no intervalo fornecido para f(x) = x^2 + 1 no intervalo [-1, 1]', () => {
    const funcao = 'x^2 + 1';
    const intervalo = [-1, 1];
    const tolerancia = 0.001;
    const maxIteracao = 100;
  
    expect(() => metodoFalsaPosicao(funcao, intervalo, tolerancia, maxIteracao))
      .toThrow('Não há raiz no intervalo fornecido, f(a) e f(b) devem ter sinais opostos, a função deve mudar de sinal no intervalo dado.');
  });

  it('deve encontrar a raiz para f(x) = x*log(x) - 1 no intervalo [2, 3]', () => {
    const funcao = 'x * log(x, 10) - 1';
    const intervalo = [2, 3];
    const tolerancia = 0.002;
    const maxIteracao = 100;
  
    expect(() => metodoFalsaPosicao(funcao, intervalo, tolerancia, maxIteracao)).not.toThrow();
  });

  it('deve encontrar a raiz para f(x) = x^3 - x - 1 no intervalo [1, 2]', () => {
    const funcao = 'x^3 - x - 1';
    const intervalo = [1, 2];
    const tolerancia = 0.002;
    const maxIteracao = 100;
  
    expect(() => metodoFalsaPosicao(funcao, intervalo, tolerancia, maxIteracao)).not.toThrow();
  });

  it('deve encontrar a raiz para f(x) = e^x + x no intervalo [-1, 0]', () => {
    const funcao = 'exp(x) + x';  // Função exp(x) + x
    const intervalo = [-1, 0];
    const tolerancia = 0.05;
    const maxIteracao = 100;

    expect(() => metodoFalsaPosicao(funcao, intervalo, tolerancia, maxIteracao)).not.toThrow();
  });
  
  it('deve encontrar a raiz da função linear f(x) = 2x - 4 no intervalo [2, 4]', () => {
    const funcao = '2*x - 4';
    const intervalo = [2, 4];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoFalsaPosicao(funcao, intervalo, tolerancia, maxIteracao);
    
    expect(resultado.raiz).toBeCloseTo(2, 3);
    expect(resultado.iteracoes).toBeLessThan(maxIteracao);
    expect(resultado.erro).toBeLessThan(tolerancia);
  });

  it('deve encontrar a raiz da função f(x) = x - 1 no intervalo [1, 2]', () => {
    const funcao = 'x - 1';
    const intervalo = [1, 2];
    const tolerancia = 0.001;
    const maxIteracao = 100;

    const resultado = metodoFalsaPosicao(funcao, intervalo, tolerancia, maxIteracao);

    expect(resultado.raiz).toBeCloseTo(1, 3);
    expect(resultado.iteracoes).toBeLessThan(maxIteracao);
    expect(resultado.erro).toBeLessThan(tolerancia);
  });

  it('deve retornar sem convergir se o número máximo de iterações for atingido', () => {
    const funcao = 'cos(x) - x'; // Exemplo que não converge rapidamente
    const intervalo = [0, 1];
    const tolerancia = 1e-10;
    const maxIteracao = 5; // Reduzido para forçar o erro

    expect(() => {
        metodoFalsaPosicao(funcao, intervalo, tolerancia, maxIteracao);
    }).toThrow('Número máximo de iterações atingido sem convergência.');
  });


  it('deve encontrar a raiz no intervalo [1, 2] para a função f(x) = x^2 - 1', () => {
    const funcao = 'x^2 - 1';
    const intervalo = [1, 2];
    const tolerancia = 0.001;
    const maxIteracao = 100;
  
    const resultado = metodoFalsaPosicao(funcao, intervalo, tolerancia, maxIteracao);
    expect(resultado.raiz).toBeCloseTo(1, 3); // Verifica se a raiz encontrada é 1
  });

  it('deve lançar erro se não houver mudança de sinal no intervalo [1.5, 2] para a função f(x) = x^2 - 1', () => {
    const funcao = 'x^2 - 1';
    const intervalo = [1.5, 2]; // Um intervalo sem mudança de sinal
    const tolerancia = 0.001;
    const maxIteracao = 100;
  
    expect(() => {
        metodoFalsaPosicao(funcao, intervalo, tolerancia, maxIteracao);
    }).toThrow('Não há raiz no intervalo fornecido, f(a) e f(b) devem ter sinais opostos, a função deve mudar de sinal no intervalo dado.');
  });

  it('deve retornar b quando f(b) = 0', () => {
    const funcao = 'x - 2'; // Define a função onde f(2) = 0
    const intervalo = [1, 2]; // O intervalo onde vamos procurar a raiz
    const tolerancia = 0.001;
    const maxIteracao = 100;
  
    const resultado = metodoFalsaPosicao(funcao, intervalo, tolerancia, maxIteracao);
  
    expect(resultado.raiz).toBe(2); // Verifica se a raiz retornada é 2
    expect(resultado.iteracoes).toBe(0); // Verifica que não houve iterações
    expect(resultado.erro).toBe(0); // Verifica que o erro é zero
    expect(resultado.convergiu).toBe(true); // Verifica que convergiu
  });

  it('deve encontrar a raiz para f(x) = x^4 - 2*x^3 - 4*x^2 + 4*x + 4 no intervalo [1.3, 1.5]', () => {
    const funcao = 'x^4 - 2*x^3 - 4*x^2 + 4*x + 4'; // A função dada
    const intervalo = [1.3, 1.5]; // Intervalo
    const tolerancia = 0.01; // Tolerância
    const maxIteracao = 100; // Número máximo de iterações

    expect(() => metodoFalsaPosicao(funcao, intervalo, tolerancia, maxIteracao)).not.toThrow();
  });
});
