const validarParametros = (metodo, params) => {
  switch (metodo) {
    case 'bisseccao':
      const { funcao: f, intervalo, tolerancia, maxIteracao } = params;
      if (typeof f !== 'string' || f.trim() === '') {
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
      break;
    
    case 'falsaPosicao':
      const { funcao: fFalsa, intervalo: intervaloFalsa, tolerancia: tolFalsa, maxIteracao: maxIteracaoFalsa } = params;
      if (typeof fFalsa !== 'string' || fFalsa.trim() === '') {
        throw new Error('A função deve ser uma string não vazia.');
      }
      if (!Array.isArray(intervaloFalsa) || intervaloFalsa.length !== 2) {
        throw new Error('O intervalo deve ser um array com dois elementos.');
      }
      if (typeof tolFalsa !== 'number' || tolFalsa <= 0) {
        throw new Error('A tolerância deve ser um número positivo.');
      }
      if (!Number.isInteger(maxIteracaoFalsa) || maxIteracaoFalsa <= 0) {
        throw new Error('O número máximo de iterações deve ser um inteiro positivo.');
      }
      break;

    case 'newtonRaphson':
      const { funcao: fNewton, chuteInicial, tolerancia: tolNewton, maxIteracao: maxIterNewton } = params;
      if (typeof fNewton !== 'string' || fNewton.trim() === '') {
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
    
    case 'secante':
      const { funcao: fSecante, x0, x1, tolerancia: tolSecante, maxIteracao: maxIterSecante } = params;
      if (typeof fSecante !== 'string' || fSecante.trim() === '') {
        throw new Error('A função deve ser uma string não vazia.');
      }
      if (typeof x0 !== 'number' || typeof x1 !== 'number') {
        throw new Error('Os pontos iniciais devem ser números.');
      }
      if (typeof tolSecante !== 'number' || tolSecante <= 0) {
        throw new Error('A tolerância deve ser um número positivo.');
      }
      if (!Number.isInteger(maxIterSecante) || maxIterSecante <= 0) {
        throw new Error('O número máximo de iterações deve ser um inteiro positivo.');
      }
      break;

    default:
      throw new Error('Método desconhecido.');
  }
};

module.exports = { validarParametros };
