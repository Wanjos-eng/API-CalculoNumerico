const { recuperarContexto, salvarContexto } = require('../services/contextoService');
const { metodoBisseccao } = require('../metodosNumericos/bisseccao');
const { metodoFalsaPosicao } = require('../metodosNumericos/falsaPosicao');
const { metodoNewtonRaphson } = require('../metodosNumericos/newtonRaphson');
const { metodoSecante } = require('../metodosNumericos/secante');
const { validarParametros } = require('../services/validacaoParametros');

const metodosNumericos = {
  bisseccao: metodoBisseccao,
  falsaPosicao: metodoFalsaPosicao,
  newtonRaphson: metodoNewtonRaphson,
  secante: metodoSecante,
};

// Função para obter o último passo do resultado anterior
const obterUltimoPasso = (contextoAnterior) => {
  const passos = contextoAnterior.resultado?.resultado?.passos;
  if (passos && passos.length > 0) {
    return passos[passos.length - 1];
  }
  return null;
};

// Função para extrair o intervalo da descrição
const extrairIntervaloDaDescricao = (descricao) => {
  const regex = /\[([0-9.]+),\s*([0-9.]+)\]/;
  const match = descricao.match(regex);
  if (match) {
    const a = parseFloat(match[1]);
    const b = parseFloat(match[2]);
    if (a < b) {
      return [a, b];
    } else {
      throw new Error('Intervalo extraído é inválido: a deve ser menor que b.');
    }
  } else {
    throw new Error('Não foi possível extrair o intervalo da descrição fornecida.');
  }
};

// Função para validar a transição de métodos e definir parâmetros adicionais
const validarTransicaoMetodo = (contextoAnterior, metodoEscolhido, params) => {
  const ultimoPasso = obterUltimoPasso(contextoAnterior);

  if (!ultimoPasso) {
    throw new Error('Não foi possível obter os dados do último passo do método anterior.');
  }

  switch (metodoEscolhido) {
    case 'bisseccao': {
      // Transição para Bissecção: Utilizar o ponto médio do último passo como novo intervalo
      const pontoMedio = ultimoPasso.pontoMedio;
      let a, b;

      if (ultimoPasso.intervaloAtual) {
        a = ultimoPasso.intervaloAtual.a;
        b = ultimoPasso.intervaloAtual.b;
      } else if (Array.isArray(contextoAnterior.intervalo)) {
        [a, b] = contextoAnterior.intervalo;
      } else if (typeof contextoAnterior.intervalo === 'object') {
        a = contextoAnterior.intervalo.a;
        b = contextoAnterior.intervalo.b;
      } else {
        throw new Error('Formato do intervalo inválido no contexto anterior.');
      }

      if (typeof pontoMedio !== 'number') {
        throw new Error('Ponto médio inválido no último passo.');
      }

      // Determinar em qual subintervalo a raiz está, baseado no sinal da função
      if (ultimoPasso.valorFuncao < 0) {
        // A raiz está entre o ponto médio e b
        return { intervalo: [pontoMedio, b] };
      } else {
        // A raiz está entre a e o ponto médio
        return { intervalo: [a, pontoMedio] };
      }
    }

    case 'falsaPosicao': {
      // Transição para Falsa Posicao: Utilizar o intervalo do último passo
      let intervalo;

      if (contextoAnterior.intervalo) {
        if (Array.isArray(contextoAnterior.intervalo)) {
          intervalo = contextoAnterior.intervalo;
        } else if (typeof contextoAnterior.intervalo === 'object') {
          intervalo = [contextoAnterior.intervalo.a, contextoAnterior.intervalo.b];
        }
      } else {
        intervalo = extrairIntervaloDaDescricao(ultimoPasso.descricao);
      }

      if (intervalo && intervalo.length === 2) {
        return { intervalo };
      } else {
        throw new Error('Não foi possível extrair o intervalo atual do método anterior.');
      }
    }

    case 'newtonRaphson': {
      // Transição para Newton-Raphson: Requer um chute inicial
      if (params.chuteInicial !== undefined) {
        const chuteInicialNum = parseFloat(params.chuteInicial);
        if (isNaN(chuteInicialNum)) {
          throw new Error('Para trocar para o método de Newton-Raphson, você deve fornecer um chute inicial numérico.');
        }
        return { chuteInicial: chuteInicialNum };
      } else {
        // Pega o ponto médio do último passo como chute inicial, se disponível
        const chuteInicialNum = ultimoPasso.pontoMedio || ultimoPasso.xAtual || ultimoPasso.xNovo;
        if (typeof chuteInicialNum === 'number') {
          return { chuteInicial: chuteInicialNum };
        } else {
          throw new Error('Não foi possível determinar um chute inicial para o método de Newton-Raphson.');
        }
      }
    }

    case 'secante': {
      // Função auxiliar para obter o intervalo anterior
      const obterIntervaloAnterior = () => {
        if (contextoAnterior.intervalo) {
          if (Array.isArray(contextoAnterior.intervalo)) {
            return contextoAnterior.intervalo;
          } else if (typeof contextoAnterior.intervalo === 'object') {
            return [contextoAnterior.intervalo.a, contextoAnterior.intervalo.b];
          }
        } else if (ultimoPasso.intervaloAtual) {
          return [ultimoPasso.intervaloAtual.a, ultimoPasso.intervaloAtual.b];
        }
        return null;
      };

      // Transição a partir de Bissecção ou Falsa Posicao
      if (['bisseccao', 'falsaPosicao'].includes(contextoAnterior.metodo)) {
        const intervalo = obterIntervaloAnterior();

        if (intervalo && intervalo.length === 2) {
          const [x0, x1] = intervalo;
          return { x0, x1 };
        }

        throw new Error('Não foi possível determinar x0 e x1 a partir do intervalo do método anterior para o Método da Secante.');
      }

      // Transição a partir de Newton-Raphson ou continuação com Secante
      if (['newtonRaphson', 'secante'].includes(contextoAnterior.metodo)) {
        const x0 = ultimoPasso.xAtual || ultimoPasso.pontoMedio || contextoAnterior.resultado?.resultado?.raiz;
        const x1 = ultimoPasso.xNovo || ultimoPasso.xAtual;

        if (typeof x0 === 'number' && typeof x1 === 'number' && x0 !== x1) {
          return { x0, x1 };
        }

        throw new Error('Não foi possível determinar x0 e x1 para continuar com o Método da Secante.');
      }

      // Caso nenhum método anterior compatível seja encontrado
      throw new Error('Para trocar para o Método da Secante, você deve fornecer x0 e x1.');
    }

    default:
      throw new Error('Método escolhido inválido.');
  }
};

const continuarSolucao = async (req, res) => {
  const userId = req.cookies.userId;
  const { metodoEscolhido, novasIteracoes, chuteInicial, x0, x1 } = req.body;

  console.log('Requisição recebida:', req.body);

  // Validação básica dos parâmetros da requisição
  if (!metodoEscolhido || !metodosNumericos[metodoEscolhido]) {
    console.error('Erro: Método inválido ou não fornecido.');
    return res.status(400).json({ error: 'Método inválido ou não fornecido.' });
  }

  if (!Number.isInteger(novasIteracoes) || novasIteracoes <= 0) {
    console.error('Erro: O número de iterações deve ser um inteiro positivo.');
    return res.status(400).json({ error: 'O número de iterações deve ser um inteiro positivo.' });
  }

  try {
    const contextoAnterior = await recuperarContexto(userId);
    if (!contextoAnterior) {
      console.error('Erro: Nenhum contexto anterior encontrado.');
      return res.status(400).json({ error: 'Nenhum contexto anterior encontrado.' });
    }

    console.log('Contexto anterior recuperado:', contextoAnterior);

    // Obter o total de iterações
    const iteracoesAnteriores = contextoAnterior.resultado?.resultado?.iteracoes || 0;
    const iteracoesTotais = iteracoesAnteriores + novasIteracoes;

    // Preparar os parâmetros adicionais
    let parametrosAdicionais;
    try {
      parametrosAdicionais = validarTransicaoMetodo(contextoAnterior, metodoEscolhido, { chuteInicial, x0, x1 });
      console.log('Parâmetros adicionais após validação:', parametrosAdicionais);
    } catch (error) {
      console.error('Erro ao validar transição de método:', error.message);
      return res.status(400).json({ error: error.message });
    }

    // Atualizar o contexto com os novos parâmetros
    const contextoAtualizado = {
      ...contextoAnterior,
      maxIteracao: contextoAnterior.maxIteracao,
      iteracoes: iteracoesTotais,
      ...parametrosAdicionais,
      metodo: metodoEscolhido,
    };

    console.log('Contexto atualizado:', contextoAtualizado);

    // Adicionar os cabeçalhos CORS antes de enviar a resposta
    res.setHeader('Access-Control-Allow-Origin', 'https://api-calculonumerico.onrender.com'); // Substitua pela origem do seu frontend
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Permite o envio de cookies
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    try {
      // Validar os parâmetros para o método escolhido
      validarParametros(metodoEscolhido, contextoAtualizado);
      console.log('Parâmetros validados com sucesso para o método:', metodoEscolhido);

      // Preparar os parâmetros para o método numérico
      const metodo = metodosNumericos[metodoEscolhido];
      const funcao = contextoAtualizado.funcao;
      const tolerancia = contextoAtualizado.tolerancia;

      let parametroMetodo;
      if (metodoEscolhido === 'newtonRaphson') {
        parametroMetodo = contextoAtualizado.chuteInicial;
      } else if (metodoEscolhido === 'secante') {
        // Verificar se x0 e x1 estão definidos
        if (typeof contextoAtualizado.x0 !== 'number' || typeof contextoAtualizado.x1 !== 'number') {
          throw new Error('Parâmetros x0 e x1 devem ser números para o método da Secante.');
        }
        parametroMetodo = [contextoAtualizado.x0, contextoAtualizado.x1];
      } else if (metodoEscolhido === 'bisseccao' || metodoEscolhido === 'falsaPosicao') {
        parametroMetodo = contextoAtualizado.intervalo;
      } else {
        throw new Error('Método escolhido não implementado.');
      }

      console.log('Parâmetros para o método:', funcao, parametroMetodo, tolerancia, novasIteracoes);

      // Executar o método escolhido
      const novoResultado = metodo(funcao, parametroMetodo, tolerancia, novasIteracoes);

      console.log('Resultado do método:', novoResultado);

      // Atualizar o contexto com o novo resultado
      await salvarContexto(userId, { ...contextoAtualizado, resultado: { resultado: novoResultado } });

      return res.status(200).json({
        metodoAnterior: contextoAnterior.metodo,
        resultadoAnterior: contextoAnterior.resultado,
        metodoAtual: metodoEscolhido,
        novoResultado,
        iteracoesTotais,
      });

    } catch (error) {
      console.error(`Erro ao aplicar o método ${metodoEscolhido}:`, error.message);
      return res.status(400).json({ error: `Erro ao aplicar o método ${metodoEscolhido}: ${error.message}` });
    }

  } catch (error) {
    console.error('Erro inesperado:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  continuarSolucao,
};
