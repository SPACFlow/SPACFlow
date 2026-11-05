// HISTÓRIA 2 — Consultar demandas (quadro + filtros de prioridade e responsável)
import { demandaRepository } from '../repositories/demandaRepository.js';
import { STATUS, COR_STATUS, PRIORIDADES, RESPONSAVEIS } from '../models/demanda.js';
import { registrarFiltro, montarFiltros, aplicarFiltros } from '../componentes/filtros.js';
import { $, esc, dataBR, diasAtraso, opcoes } from '../utils/dom.js';

export function consultarDemandas() {
  return aplicarFiltros(demandaRepository.listar());
}

function registrarFiltroSelect({ rotulo, vazio, lista, semValor, campo }) {
  registrarFiltro(
    (el, aoAlterar) => {
      el.innerHTML = `<select aria-label="${rotulo}">${opcoes(lista, vazio)}<option value="sem">${semValor}</option></select>`;
      el.querySelector('select').addEventListener('input', (e) => aoAlterar(e.target.value));
    },
    (d, valor) => (valor === 'sem' ? !d[campo] : d[campo] === valor),
  );
}

function cardHTML(d) {
  const atraso = diasAtraso(d);
  const prio = d.prioridade
    ? `<span class="tag p-${d.prioridade}">Prioridade ${d.prioridade}</span>`
    : '<span class="tag p-sem">Sem prioridade</span>';
  const sit = d.status === 'Concluído' ? '<span class="tag ok">Concluído</span>'
    : atraso ? `<span class="tag atraso">Atrasado ${atraso}d</span>` : '';
  const sei = d.numeroSei ? `<span class="chip-sei">SEI ${esc(d.numeroSei)}</span>` : '';
  return `<article class="card" tabindex="0" data-id="${d.id}">
    <div class="tags">${prio}${sit}</div>
    <h4>${esc(d.titulo)}</h4>
    <p>${esc(d.descricao) || 'Sem descrição.'}</p>
    ${sei}
    <div class="rodape"><span>${esc(d.responsavel ?? 'Não atribuído')}</span><span>Prazo ${dataBR(d.prazo)}</span></div>
  </article>`;
}

function renderQuadro() {
  const lista = consultarDemandas();
  $('#quadro').innerHTML = STATUS.map((s) => {
    const itens = lista.filter((d) => d.status === s);
    return `<section class="coluna"><h3><i style="background:${COR_STATUS[s]}"></i>${s}<em>${itens.length}</em></h3>
      ${itens.map(cardHTML).join('') || '<p class="vazio">Nenhuma demanda aqui.</p>'}</section>`;
  }).join('');
}

// aoAbrirCard(id) é chamado quando a pessoa clica em uma demanda.
export function iniciarConsulta(aoAbrirCard) {
  registrarFiltroSelect({ rotulo: 'Filtrar por prioridade', vazio: 'Toda prioridade', lista: PRIORIDADES, semValor: 'Sem prioridade', campo: 'prioridade' });
  registrarFiltroSelect({ rotulo: 'Filtrar por responsável', vazio: 'Todos responsáveis', lista: RESPONSAVEIS, semValor: 'Não atribuído', campo: 'responsavel' });
  montarFiltros($('#filtros'), renderQuadro);

  const abrir = (e) => { const c = e.target.closest('.card'); if (c) aoAbrirCard(c.dataset.id); };
  $('#quadro').addEventListener('click', abrir);
  $('#quadro').addEventListener('keydown', (e) => { if (e.key === 'Enter') abrir(e); });

  demandaRepository.inscrever(renderQuadro);
  renderQuadro();
}