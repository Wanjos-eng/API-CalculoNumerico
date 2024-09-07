const validarParametros = (funcao, intervalo, tolerancia, maxIteracao) => {
    if (typeof funcao !== 'string' || funcao.trim() === '') {
      throw new Error('A função deve ser uma string não vazia.');
    }
    if (!Array.isArray(intervalo) || intervalo.length !== 2) {
      throw new Error('O intervalo deve ser um array com dois elementos.');
    }
    if (typeof tolerancia !== 'number' || tolerancia <= 0) {
      throw new Error('A tolerância deve ser um número positivo.');
    }
    if (!Number.isInteger(maxIteracao) || maxIteracao <= 0) {
      throw new Error('O número máximo de iterações deve ser um inteiro positivo.');
    }
  };
  
module.exports = { validarParametros };
  