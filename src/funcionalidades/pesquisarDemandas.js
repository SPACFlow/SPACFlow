import { demandaRepository } from '../repositories/demandaRepository.js';
import { imprimirDemandas } from '../utils/formatacao.js';

const normalizar = (t) => String(t ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function pesquisarDemandas(termo) {
  const busca = normalizar(termo).trim();
  if (!busca) throw new Error('Digite um termo para pesquisar.');
  return demandaRepository.listar().filter((d) =>
    [d.titulo, d.descricao, d.solicitante, d.responsavel, d.numeroSei]
      .some((campo) => normalizar(campo).includes(busca)));
}

export async function executarPesquisar(rl) {
  const termo = await rl.question('Pesquisar (título, descrição, solicitante, responsável ou SEI): ');
  imprimirDemandas(pesquisarDemandas(termo));
}
