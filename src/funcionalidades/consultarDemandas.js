import { demandaRepository } from '../repositories/demandaRepository.js';
import { imprimirDemandas } from '../utils/formatacao.js';

export function consultarDemandas({ status } = {}) {
  const todas = demandaRepository.listar();
  return status ? todas.filter((d) => d.status === status) : todas;
}


 export function executarConsultar() {
  imprimirDemandas(consultarDemandas());
}

