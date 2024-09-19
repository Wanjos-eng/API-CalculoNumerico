const { falsaPosicao } = require('../../src/controllers/falsaPosicaoController');
const { metodoFalsaPosicao } = require('../../src/metodosNumericos/falsaPosicao');
const { salvarContexto } = require('../../src/services/contextoService');
const { validarParametros } = require('../../src/services/validacaoParametros');

jest.mock('../../src/metodosNumericos/falsaPosicao');
jest.mock('../../src/services/contextoService');
jest.mock('../../src/services/validacaoParametros');

describe('FalsaPosicao Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve processar uma requisição válida e retornar o resultado', async () => {
    const req = {
      body: {
        funcao: 'x^2 - 4',
        intervalo: [0, 5],
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
      iteracoes: 10,
      convergiu: true,
      erro: 0.001,
      motivoParada: 'Tolerância atingida',
      passos: [],
    };

    metodoFalsaPosicao.mockReturnValue(metodoResultado);

    await falsaPosicao(req, res);

    expect(validarParametros).toHaveBeenCalledWith('falsaPosicao', req.body);
    expect(metodoFalsaPosicao).toHaveBeenCalledWith(
      req.body.funcao,
      req.body.intervalo,
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
      throw new Error('Parâmetros inválidos para falsaPosicao.');
    });

    await falsaPosicao(req, res);

    expect(validarParametros).toHaveBeenCalledWith('falsaPosicao', req.body);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Parâmetros inválidos para falsaPosicao.' });
    expect(metodoFalsaPosicao).not.toHaveBeenCalled();
    expect(salvarContexto).not.toHaveBeenCalled();
  });

  test('Deve retornar erro 500 se o método de Falsa Posição falhar', async () => {
    const req = {
      body: {
        funcao: 'x^2 - 4',
        intervalo: [0, 5],
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

    metodoFalsaPosicao.mockImplementation(() => {
      throw new Error('Erro interno no método de Falsa Posição.');
    });

    await falsaPosicao(req, res);

    expect(validarParametros).toHaveBeenCalledWith('falsaPosicao', req.body);
    expect(metodoFalsaPosicao).toHaveBeenCalledWith(
      req.body.funcao,
      req.body.intervalo,
      req.body.tolerancia,
      req.body.maxIteracao
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno no método de Falsa Posição.' });
    expect(salvarContexto).not.toHaveBeenCalled();
  });
});
