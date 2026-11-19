import { STATUS } from '../models/demanda.js';
import { consultarDemandas } from './consultarDemandas.js';
import { imprimirDemandas } from '../utils/formatacao.js';

const normalizar = (texto) =>
  String(texto ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();

const LISTA_STATUS = STATUS.join(', ');

export function filtrarPorStatus(texto) {
  const digitado = normalizar(texto);
  if (!digitado) throw new Error(`Informe um status: ${LISTA_STATUS}.`);

  const status = STATUS.find((s) => normalizar(s) === digitado);
  if (!status) throw new Error(`O status "${String(texto).trim()}" não existe. Use um destes: ${LISTA_STATUS}.`);

  return { status, demandas: consultarDemandas({ status }) };
}

export async function executarFiltrarStatus(rl) {
  const texto = await rl.question(`Status (${LISTA_STATUS}): `);
  const { status, demandas } = filtrarPorStatus(texto);

  if (demandas.length === 0) return console.log(`Nenhuma demanda com o status ${status}.`);
  console.log(`${demandas.length} demanda(s) com o status ${status}:`);
  imprimirDemandas(demandas);
}
