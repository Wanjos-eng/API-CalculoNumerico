const math = require('mathjs'); // Necessário para avaliar a função

const validarParametros = (metodo, params) => {
  switch (metodo) {
    case 'bisseccao':
    case 'falsaPosicao':
      const { funcao, intervalo, tolerancia, maxIteracao } = params;

      // Validação da função
      if (typeof funcao !== 'string' || funcao.trim() === '') {
        throw new Error('A função deve ser uma string não vazia.');
      }

      // Validação do intervalo
      if (!Array.isArray(intervalo) || intervalo.length !== 2) {
        throw new Error('O intervalo deve ser um array com dois elementos.');
      }
      if (typeof intervalo[0] !== 'number' || typeof intervalo[1] !== 'number') {
        throw new Error('Os valores do intervalo devem ser números.');
      }

      // Validação da tolerância
      if (typeof tolerancia !== 'number' || tolerancia <= 0) {
        throw new Error('A tolerância deve ser um número positivo.');
      }

      // Validação do número máximo de iterações
      if (!Number.isInteger(maxIteracao) || maxIteracao <= 0) {
        throw new Error('O número máximo de iterações deve ser um inteiro positivo.');
      }

      // Compila a função recebida
      const f = math.compile(funcao);

      // Avalia a função nos extremos do intervalo
      const fa = f.evaluate({ x: intervalo[0] });
      const fb = f.evaluate({ x: intervalo[1] });

      // Valida se a função muda de sinal no intervalo
      if (fa * fb > 0) {
        throw new Error('A função não muda de sinal no intervalo fornecido. O método não pode ser aplicado.');
      }
      break;

    case 'secante':
      // Não há necessidade de validação de mudança de sinal para o método da Secante
      const { funcao: funcaoSecante, intervalo: intervaloSecante, tolerancia: tolSecante, maxIteracao: maxIterSecante } = params;

      // Validação da função
      if (typeof funcaoSecante !== 'string' || funcaoSecante.trim() === '') {
        throw new Error('A função deve ser uma string não vazia.');
      }

      // Validação do intervalo
      if (!Array.isArray(intervaloSecante) || intervaloSecante.length !== 2) {
        throw new Error('O intervalo deve ser um array com dois elementos.');
      }
      if (typeof intervaloSecante[0] !== 'number' || typeof intervaloSecante[1] !== 'number') {
        throw new Error('Os valores do intervalo devem ser números.');
      }

      // Validação da tolerância
      if (typeof tolSecante !== 'number' || tolSecante <= 0) {
        throw new Error('A tolerância deve ser um número positivo.');
      }

      // Validação do número máximo de iterações
      if (!Number.isInteger(maxIterSecante) || maxIterSecante <= 0) {
        throw new Error('O número máximo de iterações deve ser um inteiro positivo.');
      }
      break;

    case 'newtonRaphson':
      const { funcao: funcaoNewton, chuteInicial, tolerancia: tolNewton, maxIteracao: maxIterNewton } = params;

      // Validação da função
      if (typeof funcaoNewton !== 'string' || funcaoNewton.trim() === '') {
        throw new Error('A função deve ser uma string não vazia.');
      }

      // Validação do chute inicial
      if (typeof chuteInicial !== 'number') {
        throw new Error('O chute inicial deve ser um número.');
      }

      // Validação da tolerância
      if (typeof tolNewton !== 'number' || tolNewton <= 0) {
        throw new Error('A tolerância deve ser um número positivo.');
      }

      // Validação do número máximo de iterações
      if (!Number.isInteger(maxIterNewton) || maxIterNewton <= 0) {
        throw new Error('O número máximo de iterações deve ser um inteiro positivo.');
      }
      break;

    default:
      throw new Error('Método desconhecido.');
  }
};

module.exports = { validarParametros };
