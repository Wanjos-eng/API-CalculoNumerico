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

    metodoBisseccao.mockReturnValue({
      raiz: 2,
      iteracoes: 10,
      convergiu: true,
    });

    await bisseccao(req, res);

    expect(validarParametros).toHaveBeenCalledWith('bisseccao', req.body);
    expect(metodoBisseccao).toHaveBeenCalledWith(
      req.body.funcao,
      req.body.intervalo,
      req.body.tolerancia,
      req.body.maxIteracao
    );
    expect(salvarContexto).toHaveBeenCalledWith('user123', expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      resultado: expect.any(Object),
    });
  });

  test('Deve retornar erro 400 se a validação falhar', async () => {
    const req = {
      body: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    validarParametros.mockImplementation(() => {
      throw new Error('Parâmetros inválidos');
    });

    await bisseccao(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Parâmetros inválidos' });
  });
});
