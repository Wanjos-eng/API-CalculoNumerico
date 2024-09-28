require('dotenv').config({ path: './.env.test' });

let mockGenerateContent;
let mockGetGenerativeModel;
let mockGoogleGenerativeAI;

jest.mock('@google/generative-ai', () => {
  mockGenerateContent = jest.fn();
  mockGetGenerativeModel = jest.fn().mockReturnValue({
    generateContent: mockGenerateContent,
  });
  mockGoogleGenerativeAI = jest.fn().mockImplementation((apiKey) => ({
    getGenerativeModel: mockGetGenerativeModel,
    apiKey,
  }));

  return {
    GoogleGenerativeAI: mockGoogleGenerativeAI,
  };
});

const { enviarPerguntaIA } = require('../../src/services/geminiService');

describe('Teste do geminiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve retornar a resposta da IA', async () => {
    // Configurar o comportamento do mock antes de chamar a função a ser testada
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => 'Resposta mockada da IA',
      },
    });

    const contexto = { metodo: 'bisseccao', resultado: 'algum resultado' };
    const pergunta = 'Qual é o significado do resultado?';

    const resposta = await enviarPerguntaIA(contexto, pergunta);

    expect(resposta).toBe('Resposta mockada da IA');

    // Verificar se o construtor foi chamado com a chave correta
    expect(mockGoogleGenerativeAI).toHaveBeenCalledWith(process.env.GEMINI_KEY);

    // Verificar se o método `getGenerativeModel` foi chamado na instância mockada
    expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-1.5-flash' });

    // Verificar se o método `generateContent` foi chamado com o prompt esperado
    expect(mockGenerateContent).toHaveBeenCalledWith(expect.any(String));
  });

  test('Deve lançar um erro se a chamada à IA falhar', async () => {
    // Configurar o mock para rejeitar a promessa
    mockGenerateContent.mockRejectedValue(new Error('Falha na IA'));

    const contexto = { metodo: 'bisseccao', resultado: 'algum resultado' };
    const pergunta = 'Qual é o significado do resultado?';

    await expect(enviarPerguntaIA(contexto, pergunta)).rejects.toThrow('Falha na IA');
  });
});
