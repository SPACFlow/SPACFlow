import { demandaRepository } from '../repositories/demandaRepository.js';

const FORMATO_SEI = /^\d{4,5}\.\d{3,6}\/\d{4}-\d{2}$/;

export function registrarSei(id, numero) {
  const limpo = numero?.trim().replace(/^SEI\s*/i, '');
  if (!limpo) throw new Error('Informe o número do processo SEI.');
  if (!FORMATO_SEI.test(limpo)) throw new Error('Número inválido. Exemplo: 8918.461/2026-70');

  const demanda = demandaRepository.buscarPorId(id);
  if (!demanda) throw new Error('Demanda não encontrada.');

  const repetido = demandaRepository.listar().some((d) => d.numeroSei === limpo && d.id !== demanda.id);
  if (repetido) throw new Error('Esse processo SEI já está registrado em outra demanda.');

  demanda.numeroSei = limpo;
  return demanda;
}

export async function executarRegistrarSei(rl) {
  const id = await rl.question('ID da demanda: ');
  const numero = await rl.question('Número do processo SEI (ex.: 8918.461/2026-70): ');
  const d = registrarSei(id, numero);
  console.log(`✔ Demanda #${d.id} vinculada ao SEI ${d.numeroSei}.`);
}
