import { demandaRepository } from '../repositories/demandaRepository.js';

export function consultarDemandas({ status } = {}) {
  const todas = demandaRepository.listar();
  return status ? todas.filter((d) => d.status === status) : todas;
}

export function executarConsultar() {
  const lista = consultarDemandas();
  if (lista.length === 0) return console.log('Nenhuma demanda cadastrada.');
  console.table(
    lista.map(({ id, titulo, status, prioridade, responsavel }) => ({
      id, titulo, status, prioridade: prioridade ?? '-', responsavel: responsavel ?? '-',
    }))
  );
}