const { perguntarIA } = require('../../src/controllers/iaController');
const { recuperarContexto } = require('../../src/services/contextoService');
const { enviarPerguntaIA } = require('../../src/services/geminiService');

jest.mock('../../src/services/contextoService');
jest.mock('../../src/services/geminiService');

describe('IA Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve processar uma requisição válida e retornar a resposta da IA', async () => {
    const req = {
      body: {
        pergunta: 'Qual é a raiz da função x^2 - 4?',
      },
      cookies: {
        userId: 'user123',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const contexto = {
      funcao: 'x^2 - 4',
      intervalo: [0, 5],
      tolerancia: 0.001,
      maxIteracao: 100,
      resultado: {
        raiz: 2,
        iteracoes: 10,
        convergiu: true,
        erro: 0.001,
        motivoParada: 'Tolerância atingida',
        passos: [],
      },
    };

    const respostaIA = 'A raiz da função x^2 - 4 é 2.';

    recuperarContexto.mockResolvedValue(contexto);
    enviarPerguntaIA.mockResolvedValue(respostaIA);

    await perguntarIA(req, res);

    expect(recuperarContexto).toHaveBeenCalledWith('user123');
    expect(enviarPerguntaIA).toHaveBeenCalledWith(contexto, req.body.pergunta);
    expect(res.json).toHaveBeenCalledWith({ contexto, respostaIA });
    expect(res.status).not.toHaveBeenCalled();
  });

  test('Deve retornar erro 400 se nenhum contexto for encontrado', async () => {
    const req = {
      body: {
        pergunta: 'Qual é a raiz da função x^2 - 4?',
      },
      cookies: {
        userId: 'user123',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    recuperarContexto.mockResolvedValue(null);

    await perguntarIA(req, res);

    expect(recuperarContexto).toHaveBeenCalledWith('user123');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Nenhum contexto encontrado.' });
    expect(enviarPerguntaIA).not.toHaveBeenCalled();
  });

  test('Deve retornar erro 400 se a pergunta não for fornecida', async () => {
    const req = {
      body: {
        // Pergunta ausente
      },
      cookies: {
        userId: 'user123',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    recuperarContexto.mockResolvedValue({
      // Contexto válido
      funcao: 'x^2 - 4',
      intervalo: [0, 5],
      tolerancia: 0.001,
      maxIteracao: 100,
      resultado: {
        raiz: 2,
        iteracoes: 10,
        convergiu: true,
        erro: 0.001,
        motivoParada: 'Tolerância atingida',
        passos: [],
      },
    });

    await perguntarIA(req, res);

    expect(recuperarContexto).toHaveBeenCalledWith('user123');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Pergunta não fornecida.' });
    expect(enviarPerguntaIA).not.toHaveBeenCalled();
  });

  test('Deve retornar erro 500 se o envio da pergunta para a IA falhar', async () => {
    const req = {
      body: {
        pergunta: 'Qual é a raiz da função x^2 - 4?',
      },
      cookies: {
        userId: 'user123',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const contexto = {
      funcao: 'x^2 - 4',
      intervalo: [0, 5],
      tolerancia: 0.001,
      maxIteracao: 100,
      resultado: {
        raiz: 2,
        iteracoes: 10,
        convergiu: true,
        erro: 0.001,
        motivoParada: 'Tolerância atingida',
        passos: [],
      },
    };

    recuperarContexto.mockResolvedValue(contexto);
    enviarPerguntaIA.mockImplementation(() => {
      throw new Error('Erro ao comunicar com o serviço da IA.');
    });

    await perguntarIA(req, res);

    expect(recuperarContexto).toHaveBeenCalledWith('user123');
    expect(enviarPerguntaIA).toHaveBeenCalledWith(contexto, req.body.pergunta);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao comunicar com o serviço da IA.' });
  });
});
