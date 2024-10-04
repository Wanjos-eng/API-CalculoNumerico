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
  const regex = /\[([+-]?[\d.]+),\s*([+-]?[\d.]+)\]/;
  const match = descricao.match(regex);
  if (match) {
    const a = parseFloat(match[1]);
    const b = parseFloat(match[2]);
    if (a < b) {
      return [a, b];
    } else {
      return [b, a]; // Garante que a seja menor que b
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

  const metodosQueRequeremIntervalo = ['bisseccao', 'falsaPosicao', 'secante'];

  if (metodosQueRequeremIntervalo.includes(metodoEscolhido)) {
    // Se o método anterior foi Newton-Raphson, precisamos que o usuário forneça o intervalo
    if (contextoAnterior.metodo === 'newtonRaphson') {
      const { intervalo } = params;
      if (!Array.isArray(intervalo) || intervalo.length !== 2) {
        throw new Error('Para trocar do método Newton-Raphson para ' + metodoEscolhido + ', você deve fornecer um intervalo [a, b].');
      }
      return { intervalo };
    } else {
      // Tenta extrair o intervalo do método anterior
      let intervalo;
      try {
        intervalo = extrairIntervaloDaDescricao(ultimoPasso.descricao);
      } catch (error) {
        if (ultimoPasso.intervaloAtual) {
          intervalo = [
            ultimoPasso.intervaloAtual.xInferior || ultimoPasso.intervaloAtual.a,
            ultimoPasso.intervaloAtual.xSuperior || ultimoPasso.intervaloAtual.b,
          ];
        } else if (contextoAnterior.intervalo) {
          intervalo = contextoAnterior.intervalo;
        } else {
          throw new Error('Não foi possível determinar o intervalo para o método selecionado.');
        }
      }
      return { intervalo };
    }
  }

  if (metodoEscolhido === 'newtonRaphson') {
    // Para Newton-Raphson, usamos o ponto médio do intervalo anterior como chute inicial
    let chuteInicial;

    // Tenta obter o intervalo do último passo
    let intervalo;

    try {
      intervalo = extrairIntervaloDaDescricao(ultimoPasso.descricao);
    } catch (error) {
      if (ultimoPasso.intervaloAtual) {
        intervalo = [
          ultimoPasso.intervaloAtual.xInferior || ultimoPasso.intervaloAtual.a,
          ultimoPasso.intervaloAtual.xSuperior || ultimoPasso.intervaloAtual.b,
        ];
      } else if (contextoAnterior.intervalo) {
        intervalo = contextoAnterior.intervalo;
      } else {
        throw new Error('Não foi possível determinar o intervalo para extrair o chute inicial.');
      }
    }

    if (intervalo && intervalo.length === 2) {
      chuteInicial = (intervalo[0] + intervalo[1]) / 2;
    } else {
      throw new Error('Não foi possível determinar o intervalo para extrair o chute inicial.');
    }

    return { chuteInicial };
  }

  throw new Error('Método escolhido inválido.');
};

const continuarSolucao = async (req, res) => {
  const userId = req.cookies.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId não encontrado nos cookies.' });
  }

  const { metodoEscolhido, novasIteracoes, intervalo } = req.body;

  // Validação básica dos parâmetros da requisição
  if (!metodoEscolhido || !metodosNumericos[metodoEscolhido]) {
    return res.status(400).json({ error: 'Método inválido ou não fornecido.' });
  }

  if (!Number.isInteger(novasIteracoes) || novasIteracoes <= 0) {
    return res.status(400).json({ error: 'O número de iterações deve ser um inteiro positivo.' });
  }

  try {
    const contextoAnterior = await recuperarContexto(userId);
    if (!contextoAnterior) {
      return res.status(400).json({ error: 'Nenhum contexto anterior encontrado.' });
    }

    // Atualizar o contexto com os novos parâmetros
    const iteracoesAnteriores = contextoAnterior.resultado?.resultado?.iteracoes || 0;
    const iteracoesTotais = iteracoesAnteriores + novasIteracoes;

    let parametrosAdicionais;
    try {
      parametrosAdicionais = validarTransicaoMetodo(contextoAnterior, metodoEscolhido, { intervalo });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    // Remover parâmetros irrelevantes
    const { chuteInicial, intervalo: intervaloAnterior, ...contextoSemIrrelevantes } = contextoAnterior;

    const contextoAtualizado = {
      ...contextoSemIrrelevantes,
      ...parametrosAdicionais,
      maxIteracao: iteracoesTotais,
      metodoAnterior: contextoAnterior.metodo,
      metodo: metodoEscolhido,
    };

    // Verificar contexto atualizado
    console.log('Contexto Atualizado:', contextoAtualizado);

    // Validar parâmetros atualizados
    validarParametros(metodoEscolhido, contextoAtualizado);

    const metodo = metodosNumericos[metodoEscolhido];
    const funcao = contextoAtualizado.funcao;
    const tolerancia = contextoAtualizado.tolerancia;
    const maxIteracao = novasIteracoes;

    const parametroMetodo = contextoAtualizado.intervalo || contextoAtualizado.chuteInicial;

    const novoResultado = metodo(funcao, parametroMetodo, tolerancia, maxIteracao);

    // Atualizar o contexto com o novo resultado
    await salvarContexto(userId, { ...contextoAtualizado, resultado: novoResultado });

    return res.status(200).json({
      metodoAnterior: contextoAnterior.metodo,
      resultadoAnterior: contextoAnterior.resultado,
      metodoAtual: metodoEscolhido,
      novoResultado,
      iteracoesTotais,
    });
  } catch (error) {
    console.error('Erro no controlador continuarSolucao:', error);
    return res.status(500).json({ error: error.message });
  }
};


module.exports = {
  continuarSolucao,
};
