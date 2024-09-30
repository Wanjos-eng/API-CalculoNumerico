const { validarParametros } = require('../../src/services/validacaoParametros');

describe('Teste da função validarParametros', () => {
  // Testes para o método bisseccao
  describe('Método bisseccao', () => {
    test('Parâmetros válidos não devem lançar erro', () => {
      const params = {
        funcao: 'x^2 - 4',
        intervalo: [0, 5],
        tolerancia: 0.001,
        maxIteracao: 100
      };

      expect(() => validarParametros('bisseccao', params)).not.toThrow();
    });

    test('Função vazia deve lançar erro', () => {
      const params = {
        funcao: '',
        intervalo: [0, 5],
        tolerancia: 0.001,
        maxIteracao: 100
      };

      expect(() => validarParametros('bisseccao', params)).toThrow('A função deve ser uma string não vazia.');
    });

    test('Intervalo inválido deve lançar erro', () => {
      const params = {
        funcao: 'x^2 - 4',
        intervalo: [0],
        tolerancia: 0.001,
        maxIteracao: 100
      };

      expect(() => validarParametros('bisseccao', params)).toThrow('O intervalo deve ser um array com dois elementos.');
    });

    test('Tolerância inválida deve lançar erro', () => {
      const params = {
        funcao: 'x^2 - 4',
        intervalo: [0, 5],
        tolerancia: -0.001,
        maxIteracao: 100
      };

      expect(() => validarParametros('bisseccao', params)).toThrow('A tolerância deve ser um número positivo.');
    });

    test('MaxIteracao inválido deve lançar erro', () => {
      const params = {
        funcao: 'x^2 - 4',
        intervalo: [0, 5],
        tolerancia: 0.001,
        maxIteracao: -1
      };

      expect(() => validarParametros('bisseccao', params)).toThrow('O número máximo de iterações deve ser um inteiro positivo.');
    });
  });

  // Testes para o método falsaPosicao
  describe('Método falsaPosicao', () => {
    test('Parâmetros válidos não devem lançar erro', () => {
      const params = {
        funcao: 'x^2 - 4',
        intervalo: [0, 5],
        tolerancia: 0.001,
        maxIteracao: 100
      };

      expect(() => validarParametros('falsaPosicao', params)).not.toThrow();
    });

    test('Função vazia deve lançar erro', () => {
      const params = {
        funcao: '',
        intervalo: [0, 5],
        tolerancia: 0.001,
        maxIteracao: 100
      };

      expect(() => validarParametros('falsaPosicao', params)).toThrow('A função deve ser uma string não vazia.');
    });

    test('Intervalo inválido deve lançar erro', () => {
      const params = {
        funcao: 'x^2 - 4',
        intervalo: [0],
        tolerancia: 0.001,
        maxIteracao: 100
      };

      expect(() => validarParametros('falsaPosicao', params)).toThrow('O intervalo deve ser um array com dois elementos.');
    });

    test('Tolerância inválida deve lançar erro', () => {
      const params = {
        funcao: 'x^2 - 4',
        intervalo: [0, 5],
        tolerancia: -0.001,
        maxIteracao: 100
      };

      expect(() => validarParametros('falsaPosicao', params)).toThrow('A tolerância deve ser um número positivo.');
    });

    test('MaxIteracao inválido deve lançar erro', () => {
      const params = {
        funcao: 'x^2 - 4',
        intervalo: [0, 5],
        tolerancia: 0.001,
        maxIteracao: -1
      };

      expect(() => validarParametros('falsaPosicao', params)).toThrow('O número máximo de iterações deve ser um inteiro positivo.');
    });
  });

  // Testes para o método newtonRaphson
  describe('Método newtonRaphson', () => {
    test('Parâmetros válidos não devem lançar erro', () => {
      const params = {
        funcao: 'x^2 - 4',
        chuteInicial: 1.5,
        tolerancia: 0.001,
        maxIteracao: 100
      };

      expect(() => validarParametros('newtonRaphson', params)).not.toThrow();
    });

    test('Chute inicial inválido deve lançar erro', () => {
      const params = {
        funcao: 'x^2 - 4',
        chuteInicial: 'abc',
        tolerancia: 0.001,
        maxIteracao: 100
      };

      expect(() => validarParametros('newtonRaphson', params)).toThrow('O chute inicial deve ser um número.');
    });

    test('Tolerância inválida deve lançar erro', () => {
      const params = {
        funcao: 'x^2 - 4',
        chuteInicial: 1.5,
        tolerancia: -0.001,
        maxIteracao: 100
      };

      expect(() => validarParametros('newtonRaphson', params)).toThrow('A tolerância deve ser um número positivo.');
    });

    test('MaxIteracao inválido deve lançar erro', () => {
      const params = {
        funcao: 'x^2 - 4',
        chuteInicial: 1.5,
        tolerancia: 0.001,
        maxIteracao: -1
      };

      expect(() => validarParametros('newtonRaphson', params)).toThrow('O número máximo de iterações deve ser um inteiro positivo.');
    });

    test('Função vazia deve lançar erro', () => {
      const params = {
        funcao: '', // Valor inválido
        chuteInicial: 1.5,
        tolerancia: 0.001,
        maxIteracao: 100
      };
  
      expect(() => validarParametros('newtonRaphson', params)).toThrow('A função deve ser uma string não vazia.');
    });
  });

  // Testes para o método secante
  describe('Método secante', () => {
    test('Parâmetros válidos não devem lançar erro', () => {
      const params = {
        funcao: 'x^2 - 4',
        x0: 1,
        x1: 2,
        tolerancia: 0.001,
        maxIteracao: 100
      };

      expect(() => validarParametros('secante', params)).not.toThrow();
    });

    test('Chute inicial inválido deve lançar erro', () => {
      const params = {
        funcao: 'x^2 - 4',
        x0: 'abc', // Valor inválido
        x1: 2,
        tolerancia: 0.001,
        maxIteracao: 100
      };

      expect(() => validarParametros('secante', params)).toThrow('Os pontos iniciais devem ser números.');
    });

    // Testes adicionais para o método secante
    test('Tolerância inválida deve lançar erro', () => {
      const params = {
        funcao: 'x^2 - 4',
        x0: 1,
        x1: 2,
        tolerancia: -0.001,
        maxIteracao: 100
      };

      expect(() => validarParametros('secante', params)).toThrow('A tolerância deve ser um número positivo.');
    });

    test('MaxIteracao inválido deve lançar erro', () => {
      const params = {
        funcao: 'x^2 - 4',
        x0: 1,
        x1: 2,
        tolerancia: 0.001,
        maxIteracao: -1
      };

      expect(() => validarParametros('secante', params)).toThrow('O número máximo de iterações deve ser um inteiro positivo.');
    });

    test('Função vazia deve lançar erro', () => {
      const params = {
        funcao: '', // Valor inválido
        x0: 1,
        x1: 2,
        tolerancia: 0.001,
        maxIteracao: 100
      };
  
      expect(() => validarParametros('secante', params)).toThrow('A função deve ser uma string não vazia.');
    });
  });

  // Teste para método desconhecido
  test('Método desconhecido deve lançar erro', () => {
    expect(() => {
      validarParametros('desconhecido', {});
    }).toThrow('Método desconhecido.');
  });
});
