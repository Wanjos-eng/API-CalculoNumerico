// Mock do redis deve ser feito antes de importar o contextoService
jest.mock('redis', () => {
  const mockSet = jest.fn();
  const mockGet = jest.fn();
  const mockOn = jest.fn();
  const mockConnect = jest.fn();
  const mockDisconnect = jest.fn();

  return {
    createClient: jest.fn(() => ({
      connect: mockConnect,
      disconnect: mockDisconnect,
      set: mockSet,
      get: mockGet,
      on: mockOn,
    })),
  };
});

const redis = require('redis');
const { salvarContexto, recuperarContexto } = require('../../src/services/contextoService');

describe('Contexto Service', () => {
  let mockSet;
  let mockGet;
  let mockOn;
  let mockConnect;
  let mockDisconnect;
  let mockClient;

  beforeAll(() => {
    mockSet = jest.fn();
    mockGet = jest.fn();
    mockOn = jest.fn();
    mockConnect = jest.fn();
    mockDisconnect = jest.fn();

    mockClient = {
      connect: mockConnect,
      disconnect: mockDisconnect,
      set: mockSet,
      get: mockGet,
      on: mockOn,
    };

    redis.createClient.mockReturnValue(mockClient);
  });

  test('Deve salvar o contexto no Redis', async () => {
    mockSet.mockResolvedValue('OK');
    await salvarContexto('user123', { data: 'test' });

    expect(mockSet).toHaveBeenCalledWith(
      'user123',
      JSON.stringify({ data: 'test' }),
      { EX: 3600 }
    );
  });

  test('Deve recuperar o contexto do Redis', async () => {
    mockGet.mockResolvedValue(JSON.stringify({ data: 'test' }));

    const resultado = await recuperarContexto('user123');

    expect(mockGet).toHaveBeenCalledWith('user123');
    expect(resultado).toEqual({ data: 'test' });
  });

  test('Deve lidar com erro ao salvar no Redis', async () => {
    mockSet.mockRejectedValueOnce(new Error('Erro ao salvar no cache'));
    console.error = jest.fn(); // Mock de console.error

    await salvarContexto('user123', { data: 'test' });

    expect(console.error).toHaveBeenCalledWith('Erro ao salvar no cache:', expect.any(Error));
  });

  test('Deve lidar com erro ao recuperar do Redis', async () => {
    mockGet.mockRejectedValueOnce(new Error('Erro ao recuperar do cache'));
    console.error = jest.fn(); // Mock de console.error

    const resultado = await recuperarContexto('user123');

    expect(console.error).toHaveBeenCalledWith('Erro ao recuperar o contexto:', expect.any(Error));
    expect(resultado).toBeNull(); // Deve retornar null em caso de erro
  });

  test('Deve inicializar o cliente Redis ao salvar contexto', async () => {
    const chave = 'user123';
    const dados = { data: 'test' };

    // Chama a função salvarContexto para inicializar o cliente Redis
    await salvarContexto(chave, dados);

    // Verifica se o cliente Redis foi criado
    expect(redis.createClient).toHaveBeenCalled();
  });

  test('Deve emitir erro no cliente Redis', async () => {
    const chave = 'user123';
    const dados = { data: 'test' };

    // Simula a chamada para inicializar o cliente
    await salvarContexto(chave, dados);
    
    // Simula um erro no cliente Redis
    const errorCallback = mockOn.mock.calls[0][1]; // A função de callback de erro do cliente Redis
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(); // Mock para console.error

    // Chama o callback de erro com um erro simulado
    errorCallback(new Error('Erro no cliente Redis'));

    expect(consoleErrorMock).toHaveBeenCalledWith('Redis Client Error', expect.any(Error));

    consoleErrorMock.mockRestore(); // Restaura a implementação original
  });

  afterAll(async () => {
    await mockClient.disconnect();
  });
});
