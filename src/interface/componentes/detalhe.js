// BASE: janela de detalhe da demanda. Cada funcionalidade (história 3, 4, 5)
// registra a sua própria seção dentro dela com registrarSecao().
import { demandaRepository } from '../repositories/demandaRepository.js';
import { $, dataBR } from '../utils/dom.js';

const secoes = [];

// fn recebe (elemento, demanda) e desenha o seu campo dentro do elemento.
export function registrarSecao(fn) { secoes.push(fn); }

export function iniciarDetalhe() {
  document.body.insertAdjacentHTML('beforeend', `
    <dialog id="dlgDetalhe">
      <h2 id="detTitulo"></h2>
      <p class="meta" id="detMeta"></p>
      <p id="detDescricao"></p>
      <div id="detSecoes"></div>
      <div class="acoes"><button class="btn" id="detFechar">Fechar</button></div>
    </dialog>`);
  $('#detFechar').onclick = () => $('#dlgDetalhe').close();
}

export function abrirDetalhe(id) {
  const d = demandaRepository.buscarPorId(id);
  if (!d) return;
  $('#detTitulo').textContent = d.titulo;
  $('#detMeta').textContent = `Demanda #${d.id} · Solicitante: ${d.solicitante} · Prazo ${dataBR(d.prazo)}`;
  $('#detDescricao').textContent = d.descricao || 'Sem descrição.';
  const area = $('#detSecoes');
  area.innerHTML = '';
  secoes.forEach((desenhar) => {
    const el = document.createElement('div');
    area.appendChild(el);
    desenhar(el, d);
  });
  $('#dlgDetalhe').showModal();
}