const { bisseccao } = require('../../src/controllers/bisseccaoController');
const { metodoBisseccao } = require('../../src/metodosNumericos/bisseccao');
const { salvarContexto } = require('../../src/services/contextoService');
const { validarParametros } = require('../../src/services/validacaoParametros');

jest.mock('../../src/metodosNumericos/bisseccao');
jest.mock('../../src/services/contextoService');
jest.mock('../../src/services/validacaoParametros');

describe('Bisseccao Controller', () => {
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

    metodoBisseccao.mockReturnValue(metodoResultado);

    await bisseccao(req, res);

    expect(validarParametros).toHaveBeenCalledWith('bisseccao', req.body);
    expect(metodoBisseccao).toHaveBeenCalledWith(
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
      throw new Error('Parâmetros inválidos para bisseccao.');
    });

    await bisseccao(req, res);

    expect(validarParametros).toHaveBeenCalledWith('bisseccao', req.body);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Parâmetros inválidos para bisseccao.' });
    expect(metodoBisseccao).not.toHaveBeenCalled();
    expect(salvarContexto).not.toHaveBeenCalled();
  });

  test('Deve retornar erro 500 se o método da bissecção falhar', async () => {
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

    metodoBisseccao.mockImplementation(() => {
      throw new Error('Erro interno no método da bisseccao.');
    });

    await bisseccao(req, res);

    expect(validarParametros).toHaveBeenCalledWith('bisseccao', req.body);
    expect(metodoBisseccao).toHaveBeenCalledWith(
      req.body.funcao,
      req.body.intervalo,
      req.body.tolerancia,
      req.body.maxIteracao
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno no método da bisseccao.' });
    expect(salvarContexto).not.toHaveBeenCalled();
  });

  test('Deve retornar erro 500 se o salvarContexto falhar', async () => {
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

    metodoBisseccao.mockReturnValue({
      raiz: 2,
      iteracoes: 10,
      convergiu: true,
      erro: 0.001,
      motivoParada: 'Tolerância atingida',
      passos: [],
    });

    salvarContexto.mockImplementation(() => {
      throw new Error('Erro ao salvar contexto.');
    });

    await bisseccao(req, res);

    expect(validarParametros).toHaveBeenCalledWith('bisseccao', req.body);
    expect(metodoBisseccao).toHaveBeenCalledWith(
      req.body.funcao,
      req.body.intervalo,
      req.body.tolerancia,
      req.body.maxIteracao
    );
    expect(salvarContexto).toHaveBeenCalledWith('user123', { ...req.body, resultado: {
      raiz: 2,
      iteracoes: 10,
      convergiu: true,
      erro: 0.001,
      motivoParada: 'Tolerância atingida',
      passos: [],
    } });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao salvar contexto.' });
  });
});
