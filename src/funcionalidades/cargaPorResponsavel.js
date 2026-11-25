import { STATUS_FINAIS } from '../models/demanda.js';
import { demandaRepository } from '../repositories/demandaRepository.js';
import { hojeISO } from '../utils/formatacao.js';

const PRIORIDADES_ALTAS = ['Alta', 'Urgente'];

const normalizar = (texto) =>
  String(texto ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').trim().replace(/\s+/g, ' ').toLowerCase();

const novaLinha = (nome) => ({ nome, abertas: 0, atrasadas: 0, prioridadeAlta: 0 });

function somar(linha, demanda, hoje) {
  linha.abertas += 1;
  if (demanda.prazo && demanda.prazo < hoje) linha.atrasadas += 1;
  if (PRIORIDADES_ALTAS.includes(demanda.prioridade)) linha.prioridadeAlta += 1;
}

export function calcularCargaPorResponsavel(hoje = hojeISO()) {
  const abertas = demandaRepository.listar().filter((d) => !STATUS_FINAIS.includes(d.status));
  const porNome = new Map();
  const semResponsavel = novaLinha('Sem responsável');

  for (const demanda of abertas) {
    const chave = normalizar(demanda.responsavel);
    if (!chave) {
      somar(semResponsavel, demanda, hoje);
      continue;
    }
    if (!porNome.has(chave)) porNome.set(chave, novaLinha(String(demanda.responsavel).trim().replace(/\s+/g, ' ')));
    somar(porNome.get(chave), demanda, hoje);
  }

  const responsaveis = [...porNome.values()].sort((a, b) =>
    b.abertas - a.abertas || b.atrasadas - a.atrasadas || a.nome.localeCompare(b.nome, 'pt-BR'));

  return { responsaveis, semResponsavel };
}

const plural = (n, singular, varias) => `${n} ${n === 1 ? singular : varias}`;

const descrever = ({ nome, abertas, atrasadas, prioridadeAlta }) =>
  `  ${nome}: ${plural(abertas, 'demanda em aberto', 'demandas em aberto')} · ${plural(atrasadas, 'atrasada', 'atrasadas')} · ${prioridadeAlta} com prioridade Alta ou Urgente`;

export async function executarCargaPorResponsavel() {
  const { responsaveis, semResponsavel } = calcularCargaPorResponsavel();
  console.log('\n=== Carga de trabalho por responsável ===');

  if (responsaveis.length === 0 && semResponsavel.abertas === 0) {
    console.log('Nenhuma demanda em aberto.');
    return;
  }

  responsaveis.forEach((linha) => console.log(descrever(linha)));
  if (semResponsavel.abertas > 0) console.log(descrever(semResponsavel));
}
