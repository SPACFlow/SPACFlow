import { demandaRepository } from '../repositories/demandaRepository.js';

const ORDEM_PRIORIDADE = {
  'Baixa': 1,
  'Média': 2,
  'Alta': 3,
  'Urgente': 4,
};

const CAMPOS_ORDENACAO = ['numero', 'prazo', 'prioridade', 'dataCadastro'];

// Remove acentos e deixa em minúsculas para comparar textos
function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function temValor(valor) {
  return typeof valor === 'string' && valor.trim() !== '';
}

function validarFormatoData(data, nomeCampo) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    throw new Error(`O campo "${nomeCampo}" deve estar no formato AAAA-MM-DD.`);
  }
}

// Filtros aceitos (todos opcionais e combináveis):
//   status, origem, categoria, prioridade -> igualdade (ignora maiúsc./acentos)
//   responsavel                           -> contém o texto informado
//   texto                                 -> busca na descrição (ou título)
//   prazoDe, prazoAte                     -> intervalo de prazo (AAAA-MM-DD)
//   ordenarPor                            -> numero | prazo | prioridade | dataCadastro
//   ordem                                 -> 'asc' (padrão) ou 'desc'
export async function consultarDemandas(filtros = {}) {
  if (!filtros || typeof filtros !== 'object' || Array.isArray(filtros)) {
    throw new Error('Os filtros da consulta são inválidos.');
  }

  const {
    status, origem, categoria, prioridade, responsavel, texto,
    prazoDe, prazoAte,
    ordenarPor = 'numero',
    ordem = 'asc',
  } = filtros;

  if (temValor(prazoDe)) validarFormatoData(prazoDe, 'prazoDe');
  if (temValor(prazoAte)) validarFormatoData(prazoAte, 'prazoAte');

  if (temValor(prazoDe) && temValor(prazoAte) && prazoDe > prazoAte) {
    throw new Error('O prazo inicial não pode ser maior que o prazo final.');
  }

  if (!CAMPOS_ORDENACAO.includes(ordenarPor)) {
    throw new Error(`Ordenação inválida. Use: ${CAMPOS_ORDENACAO.join(', ')}.`);
  }

  if (ordem !== 'asc' && ordem !== 'desc') {
    throw new Error('A ordem deve ser "asc" ou "desc".');
  }

  // await funciona tanto se listar() for síncrono quanto assíncrono
  const todas = await demandaRepository.listar();

  const resultado = todas.filter((d) => {
    if (temValor(status) && normalizar(d.status) !== normalizar(status)) return false;
    if (temValor(origem) && normalizar(d.origem) !== normalizar(origem)) return false;
    if (temValor(categoria) && normalizar(d.categoria) !== normalizar(categoria)) return false;
    if (temValor(prioridade) && normalizar(d.prioridade) !== normalizar(prioridade)) return false;
    if (temValor(responsavel) && !normalizar(d.responsavel).includes(normalizar(responsavel))) return false;

    if (temValor(texto)) {
      const alvo = normalizar(`${d.titulo ?? ''} ${d.descricao ?? ''}`);
      if (!alvo.includes(normalizar(texto))) return false;
    }

    if (temValor(prazoDe) && !(d.prazo >= prazoDe)) return false;
    if (temValor(prazoAte) && !(d.prazo <= prazoAte)) return false;

    return true;
  });

  resultado.sort((a, b) => {
    let valorA = a[ordenarPor];
    let valorB = b[ordenarPor];

    if (ordenarPor === 'prioridade') {
      valorA = ORDEM_PRIORIDADE[valorA] || 0;
      valorB = ORDEM_PRIORIDADE[valorB] || 0;
    }

    if (valorA < valorB) return ordem === 'asc' ? -1 : 1;
    if (valorA > valorB) return ordem === 'asc' ? 1 : -1;
    return 0;
  });

  return resultado;
}

export async function buscarDemandaPorNumero(numero) {
  const n = Number(numero);

  if (!Number.isInteger(n) || n <= 0) {
    throw new Error('O número da demanda deve ser um inteiro positivo.');
  }

  const todas = await demandaRepository.listar();
  const demanda = todas.find((d) => Number(d.numero) === n);

  if (!demanda) throw new Error(`Demanda número ${n} não encontrada.`);

  return demanda;
}

export async function buscarDemandaPorId(id) {
  if (!temValor(id)) throw new Error('O id da demanda é obrigatório.');

  const todas = await demandaRepository.listar();
  const demanda = todas.find((d) => d.id === id.trim());

  if (!demanda) throw new Error('Demanda não encontrada.');

  return demanda;
}

// Exibe as demandas no terminal (aceita os mesmos filtros de consultarDemandas)
export async function executarConsultar(filtros = {}) {
  try {
    const lista = await consultarDemandas(filtros);

    if (lista.length === 0) {
      return console.log('Nenhuma demanda encontrada.');
    }

    console.table(
      lista.map(({ id, numero, titulo, descricao, categoria, status, prioridade, responsavel, prazo }) => ({
        numero: numero ?? '-',
        id,
        titulo: titulo ?? descricao ?? '-',
        categoria: categoria ?? '-',
        status: status ?? '-',
        prioridade: prioridade ?? '-',
        responsavel: responsavel ?? '-',
        prazo: prazo ?? '-',
      }))
    );
  } catch (erro) {
    console.error(`Erro na consulta: ${erro.message}`);
  }
}

