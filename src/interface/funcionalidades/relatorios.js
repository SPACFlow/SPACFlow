import { demandaRepository } from '../repositories/demandaRepository.js';
import { STATUS, COR_STATUS, ORIGENS, CATEGORIAS, STATUS_FINAIS } from '../models/demanda.js';
import { registrarTela } from '../componentes/navegacao.js';
import { abrirDetalhe } from '../componentes/detalhe.js';
import { esc, dataBR } from '../utils/dom.js';
import { hojeLocal } from './definirPrazo.js';

const DIA = 86400000;
const DIAS_DE_AVISO = 5;
const NAO_INFORMADA = 'Não informada';
const emAberto = (d) => !STATUS_FINAIS.includes(d.status);
const normalizar = (t) => String(t ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').trim().replace(/\s+/g, ' ').toLowerCase();

export function alertasDePrazo(lista, hoje = hojeLocal()) {
  const comDias = lista
    .filter((d) => emAberto(d) && d.prazo)
    .map((demanda) => ({ demanda, dias: Math.round((Date.parse(demanda.prazo) - Date.parse(hoje)) / DIA) }))
    .sort((a, b) => a.dias - b.dias);
  return {
    atrasadas: comDias.filter(({ dias }) => dias < 0),
    vencendo: comDias.filter(({ dias }) => dias >= 0 && dias <= DIAS_DE_AVISO),
  };
}

function agrupar(lista, campo, valores) {
  const linhas = valores.map((nome) => ({ nome, abertas: 0, encerradas: 0, total: 0 }));
  const semValor = { nome: NAO_INFORMADA, abertas: 0, encerradas: 0, total: 0 };
  for (const d of lista) {
    const linha = linhas.find(({ nome }) => nome === d[campo]) ?? semValor;
    if (emAberto(d)) linha.abertas += 1;
    else linha.encerradas += 1;
    linha.total += 1;
  }
  return semValor.total > 0 ? [...linhas, semValor] : linhas;
}

export const indicadoresOrigemCategoria = (lista) => ({
  total: lista.length,
  porOrigem: agrupar(lista, 'origem', ORIGENS),
  porCategoria: agrupar(lista, 'categoria', CATEGORIAS),
});

export function cargaPorResponsavel(lista, hoje = hojeLocal()) {
  const porNome = new Map();
  const semResponsavel = { nome: 'Sem responsável', abertas: 0, atrasadas: 0, prioridadeAlta: 0 };
  for (const d of lista.filter(emAberto)) {
    const chave = normalizar(d.responsavel);
    if (chave && !porNome.has(chave)) porNome.set(chave, { nome: String(d.responsavel).trim().replace(/\s+/g, ' '), abertas: 0, atrasadas: 0, prioridadeAlta: 0 });
    const linha = chave ? porNome.get(chave) : semResponsavel;
    linha.abertas += 1;
    if (d.prazo && d.prazo < hoje) linha.atrasadas += 1;
    if (['Alta', 'Urgente'].includes(d.prioridade)) linha.prioridadeAlta += 1;
  }
  const responsaveis = [...porNome.values()].sort((a, b) =>
    b.abertas - a.abertas || b.atrasadas - a.atrasadas || a.nome.localeCompare(b.nome, 'pt-BR'));
  return { responsaveis, semResponsavel };
}

const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;

function textoDias(dias) {
  if (dias < 0) return dias === -1 ? 'atrasada há 1 dia' : `atrasada há ${-dias} dias`;
  if (dias === 0) return 'vence hoje';
  if (dias === 1) return 'vence amanhã';
  return `vence em ${dias} dias`;
}

const itemAlerta = ({ demanda, dias }) => `
  <li><button type="button" class="item-alerta ${dias < 0 ? 'atrasada' : ''}" data-id="${demanda.id}">
    <span class="item-titulo">#${demanda.id} ${esc(demanda.titulo)}</span>
    <span class="item-meta">${esc(textoDias(dias))} · prazo ${dataBR(demanda.prazo)} · ${esc(demanda.responsavel ?? 'sem responsável')}</span>
  </button></li>`;

function blocoAlertas(lista) {
  const { atrasadas, vencendo } = alertasDePrazo(lista);
  const grupo = (titulo, itens, vazio) => `
    <div class="grupo-alerta">
      <h3>${titulo} <em>${itens.length}</em></h3>
      ${itens.length ? `<ul>${itens.map(itemAlerta).join('')}</ul>` : `<p class="vazio">${vazio}</p>`}
    </div>`;
  return `
    <section class="painel-relatorio destaque-prazos">
      <header><h2>Prazos</h2><p>Demandas em aberto atrasadas ou que vencem nos próximos ${DIAS_DE_AVISO} dias (história 11).</p></header>
      <div class="grupos-alerta">
        ${grupo('Atrasadas', atrasadas, 'Nenhuma demanda atrasada.')}
        ${grupo(`Vencem em até ${DIAS_DE_AVISO} dias`, vencendo, 'Nenhum prazo vencendo nos próximos dias.')}
      </div>
    </section>`;
}

function barras(linhas) {
  const maior = Math.max(1, ...linhas.map((l) => l.total));
  return `<ul class="barras">${linhas.map(({ nome, abertas, encerradas, total }) => `
    <li>
      <span class="barra-nome">${esc(nome)}</span>
      <span class="barra-trilho" aria-hidden="true">
        <span class="barra-aberta" style="width:${(abertas / maior) * 100}%"></span><span class="barra-encerrada" style="width:${(encerradas / maior) * 100}%"></span>
      </span>
      <span class="barra-valor">${total}<small>${total ? `${abertas} em aberto` : 'nenhuma'}</small></span>
    </li>`).join('')}</ul>`;
}

function blocoOrigemCategoria(lista) {
  const { porOrigem, porCategoria } = indicadoresOrigemCategoria(lista);
  return `
    <section class="painel-relatorio">
      <header><h2>De onde vêm as demandas</h2><p>Quantidade por origem e por categoria (história 14).</p>
        <p class="legenda"><i class="cor-aberta"></i>Em aberto <i class="cor-encerrada"></i>Concluídas ou canceladas</p></header>
      <div class="duas-colunas">
        <div><h3>Por origem</h3>${barras(porOrigem)}</div>
        <div><h3>Por categoria</h3>${barras(porCategoria)}</div>
      </div>
    </section>`;
}

function blocoCarga(lista) {
  const { responsaveis, semResponsavel } = cargaPorResponsavel(lista);
  const linhas = semResponsavel.abertas ? [...responsaveis, semResponsavel] : responsaveis;
  const maior = Math.max(1, ...linhas.map((l) => l.abertas));
  const conteudo = linhas.length ? `<ul class="carga">${linhas.map(({ nome, abertas, atrasadas, prioridadeAlta }) => `
    <li class="${nome === 'Sem responsável' ? 'sem-responsavel' : ''}">
      <div class="carga-topo"><strong>${esc(nome)}</strong><span>${plural(abertas, 'demanda em aberto', 'demandas em aberto')}</span></div>
      <span class="barra-trilho" aria-hidden="true"><span class="barra-aberta" style="width:${(abertas / maior) * 100}%"></span></span>
      <div class="carga-chips">
        <span class="tag ${atrasadas ? 'atraso' : 'neutra'}">${plural(atrasadas, 'atrasada', 'atrasadas')}</span>
        <span class="tag ${prioridadeAlta ? 'p-Alta' : 'neutra'}">${prioridadeAlta} Alta ou Urgente</span>
      </div>
    </li>`).join('')}</ul>` : '<p class="vazio">Nenhuma demanda em aberto.</p>';
  return `
    <section class="painel-relatorio">
      <header><h2>Carga de trabalho por responsável</h2><p>Só demandas em aberto, da maior carga para a menor (história 15).</p></header>
      ${conteudo}
    </section>`;
}

function blocoStatus(lista) {
  const total = Math.max(1, lista.length);
  return `
    <section class="painel-relatorio">
      <header><h2>Situação geral</h2><p>${plural(lista.length, 'demanda cadastrada', 'demandas cadastradas')}.</p></header>
      <div class="faixa-status" aria-hidden="true">${STATUS.map((s) => {
        const n = lista.filter((d) => d.status === s).length;
        return n ? `<span style="width:${(n / total) * 100}%;background:${COR_STATUS[s]}"></span>` : '';
      }).join('')}</div>
      <ul class="legenda-status">${STATUS.map((s) => `<li><i style="background:${COR_STATUS[s]}"></i>${s}<b>${lista.filter((d) => d.status === s).length}</b></li>`).join('')}</ul>
    </section>`;
}

function desenhar(el) {
  const lista = demandaRepository.listar();
  el.innerHTML = `
    <div class="relatorios">
      ${blocoAlertas(lista)}
      <div class="duas-colunas">${blocoStatus(lista)}${blocoCarga(lista)}</div>
      ${blocoOrigemCategoria(lista)}
      <p class="acoes-relatorio"><button type="button" class="btn" data-imprimir>Imprimir relatório</button></p>
    </div>`;
  el.querySelectorAll('.item-alerta').forEach((b) => b.addEventListener('click', () => abrirDetalhe(b.dataset.id)));
  el.querySelector('[data-imprimir]').addEventListener('click', () => window.print());
}

export function iniciarRelatorios() {
  registrarTela('relatorios', {
    titulo: 'Relatórios',
    subtitulo: 'Prazos, origem das demandas e carga de trabalho da equipe.',
    desenhar,
  });
}
