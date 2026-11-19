import { STATUS_FINAIS } from '../models/demanda.js';
import { demandaRepository } from '../repositories/demandaRepository.js';
import { imprimirHistorico } from './atualizarStatus.js';

export const TAMANHO_MAXIMO_RESULTADO = 500;

const normalizar = (texto) =>
  String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();

export function concluirDemanda({ id, responsavel, resultado }) {
  if (!String(id ?? '').trim()) throw new Error('Informe o ID da demanda.');

  const demanda = demandaRepository.buscarPorId(id);
  if (!demanda) throw new Error(`Demanda #${id} não encontrada. Confira o ID na lista.`);
  if (STATUS_FINAIS.includes(demanda.status)) {
    throw new Error(`A demanda #${demanda.id} já está ${demanda.status.toLowerCase()} e não pode ser concluída de novo.`);
  }
  if (!demanda.responsavel) {
    throw new Error(`A demanda #${demanda.id} ainda não tem responsável. Atribua um na opção 5 antes de concluir.`);
  }
  if (normalizar(responsavel) !== normalizar(demanda.responsavel)) {
    throw new Error(`Só ${demanda.responsavel}, responsável pela demanda #${demanda.id}, pode concluí-la.`);
  }

  const texto = String(resultado ?? '').trim();
  if (!texto) throw new Error('Descreva o resultado: o parecer ou a resposta enviada ao órgão.');
  if (texto.length > TAMANHO_MAXIMO_RESULTADO) {
    throw new Error(`O resultado deve ter no máximo ${TAMANHO_MAXIMO_RESULTADO} caracteres.`);
  }

  const anterior = demanda.status;
  const agora = new Date().toISOString();
  demanda.status = 'Concluída';
  demanda.resultado = texto;
  demanda.concluidaEm = agora;
  demanda.atualizadaEm = agora;
  demanda.historicoStatus ??= [];
  demanda.historicoStatus.push({ de: anterior, para: 'Concluída', por: demanda.responsavel, em: agora });
  return { demanda, anterior };
}

export async function executarConcluirDemanda(rl) {
  const abertas = demandaRepository.listar().filter((d) => !STATUS_FINAIS.includes(d.status));
  if (abertas.length === 0) return console.log('Nenhuma demanda em aberto para concluir.');

  console.table(
    abertas.map(({ id, titulo, status, responsavel }) => ({
      id, titulo, status, responsavel: responsavel ?? '-',
    }))
  );

  const id = await rl.question('ID da demanda: ');
  const responsavel = await rl.question('Seu nome (responsável pela demanda): ');
  const resultado = await rl.question(
    `Resultado (parecer ou resposta enviada ao órgão, até ${TAMANHO_MAXIMO_RESULTADO} caracteres): `
  );
  const { demanda } = concluirDemanda({ id, responsavel, resultado });

  const data = new Date(demanda.concluidaEm).toLocaleDateString('pt-BR');
  console.log(`✔ Demanda #${demanda.id} concluída em ${data}.`);
  console.log(`Resultado: ${demanda.resultado}`);
  imprimirHistorico(demanda);
}
