import { demandaRepository } from '../repositories/demandaRepository.js';

const STATUS_ENCERRADOS = ['Concluída', 'Cancelada'];
const TAMANHO_MAXIMO_NOME = 100;

const estaEmAberto = (demanda) => !STATUS_ENCERRADOS.includes(demanda.status);

export function atribuirResponsavel({ id, responsavel }) {
  if (!String(id ?? '').trim()) throw new Error('Informe o ID da demanda.');

  const demanda = demandaRepository.buscarPorId(id);
  if (!demanda) throw new Error(`Demanda #${id} não encontrada. Confira o ID na lista.`);
  if (!estaEmAberto(demanda)) {
    throw new Error(`A demanda #${demanda.id} está ${demanda.status.toLowerCase()} e não pode receber responsável.`);
  }

  const nome = responsavel?.trim() ?? '';
  if (!nome) throw new Error('O nome do responsável é obrigatório.');
  if (nome.length > TAMANHO_MAXIMO_NOME) {
    throw new Error(`O nome do responsável deve ter no máximo ${TAMANHO_MAXIMO_NOME} caracteres.`);
  }
  if (demanda.responsavel?.toLowerCase() === nome.toLowerCase()) {
    throw new Error(`${demanda.responsavel} já é o responsável pela demanda #${demanda.id}.`);
  }

  const anterior = demanda.responsavel;
  demanda.responsavel = nome;
  return { demanda, anterior };
}

export async function executarAtribuirResponsavel(rl) {
  const abertas = demandaRepository.listar().filter(estaEmAberto);
  if (abertas.length === 0) return console.log('Nenhuma demanda em aberto para atribuir responsável.');

  console.table(
    abertas.map(({ id, titulo, status, responsavel }) => ({
      id, titulo, status, responsavel: responsavel ?? '-',
    }))
  );

  const id = await rl.question('ID da demanda: ');
  const responsavel = await rl.question('Nome do responsável: ');
  const { demanda, anterior } = atribuirResponsavel({ id, responsavel });

  if (anterior) console.log(`Responsável da demanda #${demanda.id} alterado de ${anterior} para ${demanda.responsavel}.`);
  else console.log(`${demanda.responsavel} atribuído(a) à demanda #${demanda.id}.`);
}