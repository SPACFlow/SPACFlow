// HISTÓRIA 6 — Definir prazo
import { STATUS_FINAIS } from '../models/demanda.js';
import { demandaRepository } from '../repositories/demandaRepository.js';
import { converterDataBR, formatarDataBR, hojeISO, imprimirDemandas } from '../utils/formatacao.js';

const estaEmAberto = (demanda) => !STATUS_FINAIS.includes(demanda.status);

// Confere o ID antes de pedir a data, para o erro aparecer logo.
function buscarDemandaEmAberto(id) {
  if (!String(id ?? '').trim()) throw new Error('Informe o ID da demanda.');

  const demanda = demandaRepository.buscarPorId(id);
  if (!demanda) throw new Error(`Demanda #${id} não encontrada. Confira o ID na lista.`);
  if (!estaEmAberto(demanda)) {
    throw new Error(`A demanda #${demanda.id} está ${demanda.status.toLowerCase()} e não pode receber prazo.`);
  }
  return demanda;
}

export function definirPrazo(id, dataBR) {
  const demanda = buscarDemandaEmAberto(id);

  const prazo = converterDataBR(dataBR);
  if (prazo < hojeISO()) throw new Error('O prazo não pode ser uma data que já passou.');
  if (prazo === demanda.prazo) {
    throw new Error(`A demanda #${demanda.id} já está com prazo em ${formatarDataBR(prazo)}.`);
  }

  demanda.prazo = prazo;
  return demanda;
}

export async function executarDefinirPrazo(rl) {
  const abertas = demandaRepository.listar().filter(estaEmAberto);
  if (abertas.length === 0) return console.log('Nenhuma demanda em aberto para definir prazo.');
  imprimirDemandas(abertas);

  const id = await rl.question('ID da demanda: ');
  const { prazo: anterior } = buscarDemandaEmAberto(id);
  const data = await rl.question('Prazo (DD/MM/AAAA): ');
  const d = definirPrazo(id, data);

  if (anterior) {
    console.log(`✔ Prazo da demanda #${d.id} alterado de ${formatarDataBR(anterior)} para ${formatarDataBR(d.prazo)}.`);
  } else {
    console.log(`✔ Demanda #${d.id} com prazo em ${formatarDataBR(d.prazo)}.`);
  }
}
