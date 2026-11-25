import { demandaRepository } from '../repositories/demandaRepository.js';
import { STATUS_FINAIS } from '../models/demanda.js';
import { pode } from '../models/usuario.js';
import { registrarTela } from '../componentes/navegacao.js';
import { abrirDetalhe } from '../componentes/detalhe.js';
import { esc, dataBR, avisar } from '../utils/dom.js';
import { icones } from '../utils/icones.js';
import { registrarSei, EXEMPLO_SEI } from './registrarSei.js';

const normalizar = (t) => String(t ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function situacaoSei(lista, busca = '') {
  const termo = normalizar(busca).trim();
  const combina = (d) => !termo || [d.numeroSei, d.titulo, d.solicitante, `#${d.id}`].some((v) => normalizar(v).includes(termo));
  const vinculadas = lista.filter((d) => d.numeroSei).filter(combina);
  const pendentes = lista.filter((d) => !d.numeroSei && !STATUS_FINAIS.includes(d.status)).filter(combina);
  return {
    vinculadas: vinculadas.sort((a, b) => a.numeroSei.localeCompare(b.numeroSei)),
    pendentes: pendentes.sort((a, b) => (a.prazo ?? '9999').localeCompare(b.prazo ?? '9999')),
    totalVinculadas: lista.filter((d) => d.numeroSei).length,
    totalPendentes: lista.filter((d) => !d.numeroSei && !STATUS_FINAIS.includes(d.status)).length,
  };
}

let busca = '';

const cartaoVinculado = (d) => `
  <li class="processo">
    <div class="processo-numero">
      <span class="numero-sei">${esc(d.numeroSei)}</span>
      <button type="button" class="btn-icone" data-copiar="${esc(d.numeroSei)}" aria-label="Copiar o número ${esc(d.numeroSei)}" title="Copiar número">${icones.copiar}</button>
    </div>
    <button type="button" class="processo-demanda" data-abrir="${d.id}">
      <strong>#${d.id} ${esc(d.titulo)}</strong>
      <span>${esc(d.status)} · ${esc(d.solicitante ?? '')} · prazo ${dataBR(d.prazo)}</span>
    </button>
  </li>`;

const cartaoPendente = (d, podeVincular) => `
  <li class="processo pendente">
    <button type="button" class="processo-demanda" data-abrir="${d.id}">
      <strong>#${d.id} ${esc(d.titulo)}</strong>
      <span>${esc(d.status)} · ${esc(d.solicitante ?? '')} · prazo ${dataBR(d.prazo)}</span>
    </button>
    ${podeVincular ? `
    <form class="vincular" data-id="${d.id}" novalidate>
      <label class="sr-only" for="sei-${d.id}">Número do processo SEI da demanda #${d.id}</label>
      <input id="sei-${d.id}" name="numero" placeholder="${EXEMPLO_SEI}" autocomplete="off" spellcheck="false">
      <button type="submit" class="btn primario">Vincular</button>
      <p class="erro" role="alert"></p>
    </form>` : ''}
  </li>`;

function desenhar(el, usuario) {
  const podeVincular = pode(usuario, 'sei');
  const { vinculadas, pendentes, totalVinculadas, totalPendentes } = situacaoSei(demandaRepository.listar(), busca);
  el.innerHTML = `
    <div class="tela-sei">
      <section class="sei-resumo">
        <div class="sei-numeros">
          <div><b>${totalVinculadas}</b><span>${totalVinculadas === 1 ? 'demanda vinculada' : 'demandas vinculadas'} a processo SEI</span></div>
          <div class="${totalPendentes ? 'alerta' : ''}"><b>${totalPendentes}</b><span>em aberto sem processo SEI</span></div>
        </div>
        <div class="sei-explica">
          <h2>Como funciona</h2>
          <p>Cada demanda guarda o número do processo no SEI (formato ${EXEMPLO_SEI}), e um mesmo número não fica em duas demandas. Copie o número para consultar o andamento no SEI.</p>
          <p>A consulta automática ao andamento depende de a Prefeitura do Recife liberar o acesso aos Web Services do SEI para o sistema.</p>
        </div>
      </section>

      <div class="sei-busca">
        <label class="sr-only" for="buscaSei">Procurar por número SEI, título ou solicitante</label>
        <input id="buscaSei" type="search" placeholder="Procurar por número SEI, título ou solicitante" value="${esc(busca)}">
      </div>

      <div class="duas-colunas">
        <section class="painel-relatorio">
          <header><h2>Sem processo SEI <em>${pendentes.length}</em></h2>
            <p>${podeVincular ? 'Demandas em aberto esperando o número do processo.' : 'Só a coordenação e o administrativo vinculam processos.'}</p></header>
          ${pendentes.length ? `<ul class="lista-processos">${pendentes.map((d) => cartaoPendente(d, podeVincular)).join('')}</ul>` : '<p class="vazio">Todas as demandas em aberto já têm processo SEI.</p>'}
        </section>
        <section class="painel-relatorio">
          <header><h2>Processos vinculados <em>${vinculadas.length}</em></h2><p>Clique na demanda para ver o detalhe.</p></header>
          ${vinculadas.length ? `<ul class="lista-processos">${vinculadas.map(cartaoVinculado).join('')}</ul>` : '<p class="vazio">Nenhum processo encontrado.</p>'}
        </section>
      </div>
    </div>`;

  const campoBusca = el.querySelector('#buscaSei');
  campoBusca.addEventListener('input', () => {
    busca = campoBusca.value;
    const posicao = campoBusca.selectionStart;
    desenhar(el, usuario);
    const novo = el.querySelector('#buscaSei');
    novo.focus();
    novo.setSelectionRange(posicao, posicao);
  });
  el.querySelectorAll('[data-abrir]').forEach((b) => b.addEventListener('click', () => abrirDetalhe(b.dataset.abrir)));
  el.querySelectorAll('[data-copiar]').forEach((b) => b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(b.dataset.copiar);
      avisar(`Número ${b.dataset.copiar} copiado.`);
    } catch {
      avisar('Não foi possível copiar. Selecione o número e copie manualmente.');
    }
  }));
  el.querySelectorAll('form.vincular').forEach((form) => form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const { demanda } = await registrarSei(form.dataset.id, form.numero.value);
      avisar(`Demanda #${demanda.id} vinculada ao SEI ${demanda.numeroSei}.`);
    } catch (falha) {
      form.querySelector('.erro').textContent = falha.message;
    }
  }));
}

export function iniciarIntegracaoSei() {
  registrarTela('sei', {
    titulo: 'Integração SEI',
    subtitulo: 'Processos SEI vinculados às demandas da VISAT.',
    desenhar,
  });
}
