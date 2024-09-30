const { newtonRaphson } = require('../../src/controllers/newtonController');
const { metodoNewtonRaphson } = require('../../src/metodosNumericos/newtonRaphson');
const { salvarContexto } = require('../../src/services/contextoService');
const { validarParametros } = require('../../src/services/validacaoParametros');

jest.mock('../../src/metodosNumericos/newtonRaphson');
jest.mock('../../src/services/contextoService');
jest.mock('../../src/services/validacaoParametros');

describe('NewtonRaphson Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve processar uma requisição válida e retornar o resultado', async () => {
    const req = {
      body: {
        funcao: 'x^2 - 4',
        chuteInicial: 3,
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
      resultado: {
        raiz: 2,
        iteracoes: 5,
        convergiu: true,
        erro: 0.0005,
        motivoParada: 'Tolerância atingida',
        derivada: '2 * x',
        passos: [],
      }
    };

    metodoNewtonRaphson.mockReturnValue(metodoResultado);

    await newtonRaphson(req, res);

    expect(validarParametros).toHaveBeenCalledWith('newtonRaphson', req.body);
    expect(metodoNewtonRaphson).toHaveBeenCalledWith(
      req.body.funcao,
      req.body.chuteInicial,
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
      throw new Error('Parâmetros inválidos para newtonRaphson.');
    });

    await newtonRaphson(req, res);

    expect(validarParametros).toHaveBeenCalledWith('newtonRaphson', req.body);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Parâmetros inválidos para newtonRaphson.' });
    expect(metodoNewtonRaphson).not.toHaveBeenCalled();
    expect(salvarContexto).not.toHaveBeenCalled();
  });

  test('Deve retornar erro 500 se o método de Newton-Raphson falhar', async () => {
    const req = {
      body: {
        funcao: 'x^2 - 4',
        chuteInicial: 3,
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

    metodoNewtonRaphson.mockImplementation(() => {
      throw new Error('Erro interno no método de Newton-Raphson.');
    });

    await newtonRaphson(req, res);

    expect(validarParametros).toHaveBeenCalledWith('newtonRaphson', req.body);
    expect(metodoNewtonRaphson).toHaveBeenCalledWith(
      req.body.funcao,
      req.body.chuteInicial,
      req.body.tolerancia,
      req.body.maxIteracao
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno no método de Newton-Raphson.' });
    expect(salvarContexto).not.toHaveBeenCalled();
  });
});