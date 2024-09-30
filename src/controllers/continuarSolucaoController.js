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
    case 'bisseccao':
    case 'falsaPosicao': {
      // Transição para Bissecção ou Falsa Posição: Utilizar o intervalo do último passo
      const intervalo = contextoAnterior.intervalo || extrairIntervaloDaDescricao(ultimoPasso.descricao);
      if (intervalo && intervalo.length === 2) {
        return { intervalo };
      } else if (
        ultimoPasso.intervaloAtual &&
        typeof ultimoPasso.intervaloAtual.a === 'number' &&
        typeof ultimoPasso.intervaloAtual.b === 'number'
      ) {
        return { intervalo: [ultimoPasso.intervaloAtual.a, ultimoPasso.intervaloAtual.b] };
      }
      throw new Error('Não foi possível extrair o intervalo atual do método anterior.');
    }

    case 'newtonRaphson': {
      // Transição para Newton-Raphson: Requer um chute inicial
      if (params.chuteInicial !== undefined) {
        const chuteInicialNum = parseFloat(params.chuteInicial);
        if (isNaN(chuteInicialNum)) {
          throw new Error('Para trocar para o método de Newton-Raphson, você deve fornecer um chute inicial numérico.');
        }
        return { chuteInicial: chuteInicialNum };
      } else if (typeof ultimoPasso.pontoMedio === 'number') {
        return { chuteInicial: ultimoPasso.pontoMedio };
      } else if (typeof ultimoPasso.xAtual === 'number') {
        return { chuteInicial: ultimoPasso.xAtual };
      }
      throw new Error('Não foi possível determinar um chute inicial para o método de Newton-Raphson.');
    }

    case 'secante': {
      // Transição para Secante: Utilizar x0 e x1 adequados
      if (contextoAnterior.metodo === 'bisseccao' || contextoAnterior.metodo === 'falsaPosicao') {
        const { intervaloAtual, pontoMedio } = ultimoPasso;

        if (intervaloAtual && typeof pontoMedio === 'number') {
          const { a, b } = intervaloAtual;
          return { x0: pontoMedio, x1: a === pontoMedio ? b : a };
        }
        throw new Error('Não foi possível determinar x0 e x1 para o método da Secante.');
      } else if (typeof ultimoPasso.xAtual === 'number' && typeof ultimoPasso.xNovo === 'number') {
        return { x0: ultimoPasso.xAtual, x1: ultimoPasso.xNovo };
      }
      throw new Error('Não foi possível determinar x0 e x1 para continuar o método da Secante.');
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
        parametroMetodo = [contextoAtualizado.x0, contextoAtualizado.x1];
      } else {
        parametroMetodo = contextoAtualizado.intervalo;
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
