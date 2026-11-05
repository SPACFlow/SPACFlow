// HISTÓRIA 9 — Visualizar indicadores
import { demandaRepository } from '../repositories/demandaRepository.js';
import { STATUS } from '../models/demanda.js';
import { $, diasAtraso } from '../utils/dom.js';

export function calcularIndicadores() {
  const todas = demandaRepository.listar();
  return {
    total: todas.length,
    porStatus: Object.fromEntries(STATUS.map((s) => [s, todas.filter((d) => d.status === s).length])),
    semResponsavel: todas.filter((d) => !d.responsavel).length,
    comSei: todas.filter((d) => d.numeroSei).length,
    prazosVencidos: todas.filter((d) => diasAtraso(d) > 0).length,
  };
}

function desenhar() {
  const i = calcularIndicadores();
  const cartoes = [
    ['Total de demandas', i.total, 'na base do spaceflow', 'var(--azul)'],
    ['Em tratamento', i.porStatus['Em tratamento'], 'em andamento', 'var(--verde)'],
    ['Com processo SEI', i.comSei, 'referência registrada', 'var(--ciano)'],
    ['Prazos vencidos', i.prazosVencidos, 'requer ação imediata', 'var(--vermelho)'],
  ];
  $('#indicadores').innerHTML = cartoes.map(([titulo, valor, nota, cor]) =>
    `<div class="indicador"><span>${titulo}</span><b style="color:${cor}">${valor}</b><small>${nota}</small></div>`).join('');
}

export function iniciarIndicadores() {
  demandaRepository.inscrever(desenhar);
  desenhar();
}