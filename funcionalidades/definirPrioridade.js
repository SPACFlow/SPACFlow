import { demandaRepository } from '../repositories/demandaRepository.js';
import { PRIORIDADES } from '../models/demanda.js';

const STATUS_ENCERRADOS = ['Concluída', 'Cancelada'];

const estaEmAberto = (demanda) => !STATUS_ENCERRADOS.includes(demanda.status);

// Remove acentos e maiúsculas para aceitar "media", "MÉDIA", "urgente" etc.
const normalizar = (texto) =>
  String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

// Peso da prioridade: Urgente = 4 ... Baixa = 1. Sem prioridade (ou inválida) = 0.
const pesoPrioridade = (prioridade) => PRIORIDADES.indexOf(prioridade) + 1;

// Ordena (sem alterar a lista original) por:
//   1) prioridade, da mais alta para a mais baixa
//   2) data de cadastro, da mais antiga para a mais recente
//   3) id, como desempate final
export function ordenarPorPrioridade(demandas) {
  return [...demandas].sort((a, b) => {
    const diferencaPeso = pesoPrioridade(b.prioridade) - pesoPrioridade(a.prioridade);
    if (diferencaPeso !== 0) return diferencaPeso;

    if (a.criadaEm && b.criadaEm && a.criadaEm !== b.criadaEm) {
      return a.criadaEm < b.criadaEm ? -1 : 1;
    }

    return String(a.id).localeCompare(String(b.id), 'pt-BR', { numeric: true });
  });
}

// Analisa as demandas e devolve a fila ordenada por prioridade.
// Por padrão considera só as demandas em aberto.
export function listarPorPrioridade({ incluirEncerradas = false } = {}) {
  const todas = demandaRepository.listar();
  const consideradas = incluirEncerradas ? todas : todas.filter(estaEmAberto);
  return ordenarPorPrioridade(consideradas);
}

// Define (ou altera) a prioridade de uma demanda
export function definirPrioridade({ id, prioridade }) {
  if (!String(id ?? '').trim()) throw new Error('Informe o ID da demanda.');

  const demanda = demandaRepository.buscarPorId(id);
  if (!demanda) throw new Error(`Demanda #${id} não encontrada. Confira o ID na lista.`);
  if (!estaEmAberto(demanda)) {
    throw new Error(`A demanda #${demanda.id} está ${demanda.status.toLowerCase()} e não pode ter a prioridade alterada.`);
  }

  const escolhida = PRIORIDADES.find((p) => normalizar(p) === normalizar(prioridade));
  if (!escolhida) {
    throw new Error(`Prioridade inválida. Use: ${PRIORIDADES.join(', ')}.`);
  }
  if (demanda.prioridade === escolhida) {
    throw new Error(`A demanda #${demanda.id} já está com prioridade ${escolhida}.`);
  }

  const anterior = demanda.prioridade;
  demanda.prioridade = escolhida;
  return { demanda, anterior };
}

function exibirFila(lista) {
  console.table(
    lista.map(({ id, titulo, status, prioridade, responsavel }, indice) => ({
      posicao: indice + 1,
      id,
      titulo: titulo ?? '-',
      status: status ?? '-',
      prioridade: prioridade ?? 'Sem prioridade',
      responsavel: responsavel ?? '-',
    }))
  );
}

export async function executarDefinirPrioridade(rl) {
  const fila = listarPorPrioridade();
  if (fila.length === 0) return console.log('Nenhuma demanda em aberto para priorizar.');

  console.log('Demandas em aberto, da maior para a menor prioridade:');
  exibirFila(fila);

  const id = await rl.question('ID da demanda para alterar a prioridade (Enter para sair): ');
  if (!id.trim()) return;

  const prioridade = await rl.question(`Nova prioridade (${PRIORIDADES.join(', ')}): `);
  const { demanda, anterior } = definirPrioridade({ id, prioridade });

  if (anterior) console.log(`Prioridade da demanda #${demanda.id} alterada de ${anterior} para ${demanda.prioridade}.`);
  else console.log(`Prioridade ${demanda.prioridade} definida para a demanda #${demanda.id}.`);

  console.log('\nFila atualizada:');
  exibirFila(listarPorPrioridade());
}