const validarParametros = (metodo, params) => {
  switch (metodo) {
    case 'bisseccao':
    case 'falsaPosicao':
    case 'secante':
      const { funcao, intervalo, tolerancia, maxIteracao } = params;
      if (typeof funcao !== 'string' || funcao.trim() === '') {
        throw new Error('A função deve ser uma string não vazia.');
      }
      if (!Array.isArray(intervalo) || intervalo.length !== 2) {
        throw new Error('O intervalo deve ser um array com dois elementos.');
      }
      if (typeof intervalo[0] !== 'number' || typeof intervalo[1] !== 'number') {
        throw new Error('Os valores do intervalo devem ser números.');
      }
      if (typeof tolerancia !== 'number' || tolerancia <= 0) {
        throw new Error('A tolerância deve ser um número positivo.');
      }
      if (!Number.isInteger(maxIteracao) || maxIteracao <= 0) {
        throw new Error('O número máximo de iterações deve ser um inteiro positivo.');
      }
      break;

    case 'newtonRaphson':
      const { funcao: funcaoNewton, chuteInicial, tolerancia: tolNewton, maxIteracao: maxIterNewton } = params;
      if (typeof funcaoNewton !== 'string' || funcaoNewton.trim() === '') {
        throw new Error('A função deve ser uma string não vazia.');
      }
      if (typeof chuteInicial !== 'number') {
        throw new Error('O chute inicial deve ser um número.');
      }
      if (typeof tolNewton !== 'number' || tolNewton <= 0) {
        throw new Error('A tolerância deve ser um número positivo.');
      }
      if (!Number.isInteger(maxIterNewton) || maxIterNewton <= 0) {
        throw new Error('O número máximo de iterações deve ser um inteiro positivo.');
      }
      break;

    default:
      throw new Error('Método desconhecido.');
  }
};

module.exports = { validarParametros };
