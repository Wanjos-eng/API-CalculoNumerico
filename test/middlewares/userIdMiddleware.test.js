jest.mock('uuid', () => ({
    v4: jest.fn(),
  }));
  
  const { v4: uuidv4 } = require('uuid');
  const userIdMiddleware = require('../../src/middlewares/userIdMiddleware');
  
  describe('Teste do userIdMiddleware', () => {
    let req;
    let res;
    let next;
  
    beforeEach(() => {
      req = {
        cookies: {},
      };
      res = {
        cookie: jest.fn(),
      };
      next = jest.fn();
      uuidv4.mockReset();
    });
  
    test('Deve gerar um userId e definir o cookie se não existir', () => {
      const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
      uuidv4.mockReturnValue(mockUserId);
  
      userIdMiddleware(req, res, next);
  
      expect(uuidv4).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledWith('userId', mockUserId, { maxAge: 3600000, httpOnly: true });
      expect(req.cookies.userId).toBe(mockUserId);
      expect(next).toHaveBeenCalled();
    });
  
    test('Não deve gerar um novo userId se já existir', () => {
      req.cookies.userId = 'existente-user-id';
  
      userIdMiddleware(req, res, next);
  
      expect(uuidv4).not.toHaveBeenCalled();
      expect(res.cookie).not.toHaveBeenCalled();
      expect(req.cookies.userId).toBe('existente-user-id');
      expect(next).toHaveBeenCalled();
    });
  });
  