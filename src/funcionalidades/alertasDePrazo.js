import { STATUS_FINAIS } from '../models/demanda.js';
import { demandaRepository } from '../repositories/demandaRepository.js';
import { formatarDataBR, hojeISO } from '../utils/formatacao.js';

export const DIAS_DE_AVISO = 5;

const UM_DIA = 24 * 60 * 60 * 1000;
const diasAte = (deISO, ateISO) => Math.round((Date.parse(ateISO) - Date.parse(deISO)) / UM_DIA);

export function alertasDePrazo(hoje = hojeISO()) {
  const comPrazo = demandaRepository
    .listar()
    .filter((d) => d.prazo && !STATUS_FINAIS.includes(d.status))
    .map((demanda) => ({ demanda, dias: diasAte(hoje, demanda.prazo) }))
    .sort((a, b) => a.dias - b.dias || a.demanda.id - b.demanda.id);

  return {
    atrasadas: comPrazo.filter(({ dias }) => dias < 0),
    vencendo: comPrazo.filter(({ dias }) => dias >= 0 && dias <= DIAS_DE_AVISO),
  };
}

function quando(dias) {
  if (dias < -1) return `atrasada há ${-dias} dias`;
  if (dias === -1) return 'atrasada há 1 dia';
  if (dias === 0) return 'vence hoje';
  if (dias === 1) return 'vence amanhã';
  return `vence em ${dias} dias`;
}

function imprimirGrupo(titulo, alertas) {
  console.log(`\n${titulo} (${alertas.length}):`);
  if (alertas.length === 0) return console.log('  Nenhuma.');
  for (const { demanda, dias } of alertas) {
    const responsavel = demanda.responsavel ?? 'sem responsável';
    console.log(`  #${demanda.id} ${demanda.titulo} · prazo ${formatarDataBR(demanda.prazo)} · ${quando(dias)} · ${responsavel}`);
  }
}

export async function executarAlertasDePrazo() {
  const { atrasadas, vencendo } = alertasDePrazo();
  if (atrasadas.length === 0 && vencendo.length === 0) {
    return console.log(`Nenhuma demanda atrasada ou vencendo nos próximos ${DIAS_DE_AVISO} dias.`);
  }
  imprimirGrupo('Atrasadas', atrasadas);
  imprimirGrupo(`Vencem nos próximos ${DIAS_DE_AVISO} dias`, vencendo);
}
