import { demandaRepository } from '../repositories/demandaRepository.js';
import { STATUS } from '../models/demanda.js';

export const STATUS_VALIDOS = STATUS;

const STATUS_ENCERRADOS = ['Concluída', 'Cancelada'];

const estaEmAberto = (demanda) => !STATUS_ENCERRADOS.includes(demanda.status);

// Remove acentos e maiúsculas para aceitar "em andamento", "CONCLUIDA" etc.
const normalizar = (texto) =>
  String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();

// Atualiza o status de uma demanda. Só o responsável pela demanda pode fazer isso (história 3).
export function atualizarStatus({ id, novoStatus, responsavel }) {
  if (!String(id ?? '').trim()) throw new Error('Informe o ID da demanda.');

  const demanda = demandaRepository.buscarPorId(id);
  if (!demanda) throw new Error(`Demanda #${id} não encontrada. Confira o ID na lista.`);
  if (!estaEmAberto(demanda)) {
    throw new Error(`A demanda #${demanda.id} está ${demanda.status.toLowerCase()} e não pode mudar de status.`);
  }
  if (!demanda.responsavel) {
    throw new Error(`A demanda #${demanda.id} ainda não tem responsável. Atribua um na opção 5 antes de atualizar o status.`);
  }
  if (normalizar(responsavel) !== normalizar(demanda.responsavel)) {
    throw new Error(`Só ${demanda.responsavel}, responsável pela demanda #${demanda.id}, pode atualizar o status.`);
  }

  const escolhido = STATUS_VALIDOS.find((s) => normalizar(s) === normalizar(novoStatus));
  if (!escolhido) throw new Error(`Status inválido. Use: ${STATUS_VALIDOS.join(', ')}.`);
  if (escolhido === demanda.status) {
    throw new Error(`A demanda #${demanda.id} já está com status ${escolhido}.`);
  }

  const anterior = demanda.status;
  demanda.status = escolhido;
  demanda.atualizadaEm = new Date().toISOString();
  return { demanda, anterior };
}

export async function executarAtualizarStatus(rl) {
  const abertas = demandaRepository.listar().filter(estaEmAberto);
  if (abertas.length === 0) return console.log('Nenhuma demanda em aberto para atualizar.');

  console.table(
    abertas.map(({ id, titulo, status, responsavel }) => ({
      id, titulo, status, responsavel: responsavel ?? '-',
    }))
  );

  const id = await rl.question('ID da demanda: ');
  const responsavel = await rl.question('Seu nome (responsável pela demanda): ');
  const novoStatus = await rl.question(`Novo status (${STATUS_VALIDOS.join(', ')}): `);
  const { demanda, anterior } = atualizarStatus({ id, novoStatus, responsavel });

  console.log(`Status da demanda #${demanda.id} alterado de ${anterior} para ${demanda.status}.`);
}
