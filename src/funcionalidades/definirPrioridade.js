import { demandaRepository } from '../repositories/demandaRepository.js';
import { PRIORIDADES } from '../models/demanda.js';

const STATUS_ENCERRADOS = ['Concluída', 'Cancelada'];

const estaEmAberto = (demanda) => !STATUS_ENCERRADOS.includes(demanda.status);

const normalizar = (texto) =>
  String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

const pesoPrioridade = (prioridade) => PRIORIDADES.indexOf(prioridade) + 1;

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

export function listarPorPrioridade({ incluirEncerradas = false } = {}) {
  const todas = demandaRepository.listar();
  const consideradas = incluirEncerradas ? todas : todas.filter(estaEmAberto);
  return ordenarPorPrioridade(consideradas);
}

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