import { demandaRepository } from '../repositories/demandaRepository.js';
import { imprimirDemandas } from '../utils/formatacao.js';

const FORMATO_SEI = /^\d{4,5}\.\d{3,6}\/(\d{4})-\d{2}$/;
const EXEMPLO_SEI = '8918.461/2026-70';

function buscarDemanda(id) {
  if (!String(id ?? '').trim()) throw new Error('Informe o ID da demanda.');

  const demanda = demandaRepository.buscarPorId(id);
  if (!demanda) throw new Error(`Demanda #${id} não encontrada. Confira o ID na lista.`);
  return demanda;
}

export function registrarSei(id, numero) {
  const demanda = buscarDemanda(id);

  const limpo = String(numero ?? '').trim().replace(/^SEI\s*(n[º°.]\s*)?/i, '');
  if (!limpo) throw new Error('Informe o número do processo SEI.');

  const formato = FORMATO_SEI.exec(limpo);
  if (!formato) throw new Error(`Número do SEI inválido. Use o formato ${EXEMPLO_SEI}.`);
  if (Number(formato[1]) > new Date().getFullYear()) {
    throw new Error('O ano do processo SEI não pode ser maior que o ano atual.');
  }

  if (demanda.numeroSei === limpo) {
    throw new Error(`A demanda #${demanda.id} já está vinculada ao SEI ${limpo}.`);
  }
  const outra = demandaRepository.listar().find((d) => d.numeroSei === limpo);
  if (outra) throw new Error(`O SEI ${limpo} já está registrado na demanda #${outra.id}.`);

  demanda.numeroSei = limpo;
  return demanda;
}

export async function executarRegistrarSei(rl) {
  const demandas = demandaRepository.listar();
  if (demandas.length === 0) return console.log('Nenhuma demanda cadastrada para registrar o processo SEI.');
  imprimirDemandas(demandas);

  const id = await rl.question('ID da demanda: ');
  const { numeroSei: anterior } = buscarDemanda(id);
  const numero = await rl.question(`Número do processo SEI (ex.: ${EXEMPLO_SEI}): `);
  const d = registrarSei(id, numero);

  if (anterior) console.log(`✔ SEI da demanda #${d.id} alterado de ${anterior} para ${d.numeroSei}.`);
  else console.log(`✔ Demanda #${d.id} vinculada ao SEI ${d.numeroSei}.`);
}
