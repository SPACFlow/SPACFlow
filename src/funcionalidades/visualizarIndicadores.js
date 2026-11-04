import { STATUS, STATUS_FINAIS, PRIORIDADES } from '../models/demanda.js';
import { demandaRepository } from '../repositories/demandaRepository.js';
import { hojeISO } from '../utils/formatacao.js';

export function calcularIndicadores() {
  const todas = demandaRepository.listar();
  const hoje = hojeISO();
  const contar = (chave, valores) =>
    Object.fromEntries(valores.map((v) => [v, todas.filter((d) => d[chave] === v).length]));

  return {
    total: todas.length,
    porStatus: contar('status', STATUS),
    porPrioridade: {
      ...contar('prioridade', PRIORIDADES),
      'Sem prioridade': todas.filter((d) => !d.prioridade).length,
    },
    semResponsavel: todas.filter((d) => !d.responsavel).length,
    comSei: todas.filter((d) => d.numeroSei).length,
    prazosVencidos: todas.filter((d) => d.prazo && d.prazo < hoje && !STATUS_FINAIS.includes(d.status)).length,
  };
}

export function executarIndicadores() {
  const i = calcularIndicadores();
  console.log('\n=== Indicadores ===');
  console.log(`Total de demandas: ${i.total}`);
  console.log(`Prazos vencidos: ${i.prazosVencidos}`);
  console.log(`Sem responsável: ${i.semResponsavel}`);
  console.log(`Com processo SEI: ${i.comSei}`);
  console.log('\nPor status:');
  console.table(i.porStatus);
  console.log('Por prioridade:');
  console.table(i.porPrioridade);
}
