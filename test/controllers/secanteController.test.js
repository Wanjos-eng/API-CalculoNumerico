const { secante } = require('../../src/controllers/secanteController');
const { metodoSecante } = require('../../src/metodosNumericos/secante');
const { salvarContexto } = require('../../src/services/contextoService');
const { validarParametros } = require('../../src/services/validacaoParametros');

jest.mock('../../src/metodosNumericos/secante');
jest.mock('../../src/services/contextoService');
jest.mock('../../src/services/validacaoParametros');

describe('Secante Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve processar uma requisição válida e retornar o resultado', async () => {
    const req = {
      body: {
        funcao: 'x^2 - 4',
        x0: 1,
        x1: 3,
        tolerancia: 0.001,
        maxIteracao: 100,
      },
      cookies: {
        userId: 'user123',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const metodoResultado = {
      raiz: 2,
      iteracoes: 8,
      convergiu: true,
      erro: 0.0008,
      motivoParada: 'Tolerância atingida',
      passos: [],
    };

    metodoSecante.mockReturnValue(metodoResultado);

    await secante(req, res);

    expect(validarParametros).toHaveBeenCalledWith('secante', req.body);
    expect(metodoSecante).toHaveBeenCalledWith(
      req.body.funcao,
      req.body.x0,
      req.body.x1,
      req.body.tolerancia,
      req.body.maxIteracao
    );
    expect(salvarContexto).toHaveBeenCalledWith('user123', { ...req.body, resultado: metodoResultado });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ resultado: metodoResultado });
  });

  test('Deve retornar erro 400 se a validação falhar', async () => {
    const req = {
      body: {
        // Parâmetros ausentes ou inválidos
      },
      cookies: {
        userId: 'user123',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    validarParametros.mockImplementation(() => {
      throw new Error('Parâmetros inválidos para secante.');
    });

    await secante(req, res);

    expect(validarParametros).toHaveBeenCalledWith('secante', req.body);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Parâmetros inválidos para secante.' });
    expect(metodoSecante).not.toHaveBeenCalled();
    expect(salvarContexto).not.toHaveBeenCalled();
  });

  test('Deve retornar erro 500 se o método de Secante falhar', async () => {
    const req = {
      body: {
        funcao: 'x^2 - 4',
        x0: 1,
        x1: 3,
        tolerancia: 0.001,
        maxIteracao: 100,
      },
      cookies: {
        userId: 'user123',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    validarParametros.mockImplementation(() => {}); // Passa a validação

    metodoSecante.mockImplementation(() => {
      throw new Error('Erro interno no método de Secante.');
    });

    await secante(req, res);

    expect(validarParametros).toHaveBeenCalledWith('secante', req.body);
    expect(metodoSecante).toHaveBeenCalledWith(
      req.body.funcao,
      req.body.x0,
      req.body.x1,
      req.body.tolerancia,
      req.body.maxIteracao
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno no método de Secante.' });
    expect(salvarContexto).not.toHaveBeenCalled();
  });
});
