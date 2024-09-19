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
  
    afterAll(async () => {
      await mockClient.disconnect();
    });
  });
  