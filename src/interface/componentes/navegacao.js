import { demandaRepository } from '../repositories/demandaRepository.js';
import { usuarioAtual } from '../funcionalidades/login.js';
import { pode } from '../models/usuario.js';
import { $ } from '../utils/dom.js';

const telas = {
  painel: { titulo: 'Painel de Demandas', subtitulo: 'Acompanhamento centralizado das demandas da VISAT.' },
};

export function registrarTela(id, { titulo, subtitulo, desenhar }) {
  telas[id] = { titulo, subtitulo, desenhar };
}

const telaDoEndereco = () => {
  const id = location.hash.replace('#', '');
  return telas[id] ? id : 'painel';
};

export function mostrarTela(id = telaDoEndereco()) {
  const usuario = usuarioAtual();
  if (!usuario) return;
  const tela = telas[id];

  document.querySelectorAll('main [data-tela]').forEach((el) => { el.hidden = el.dataset.tela !== id; });
  document.querySelectorAll('#menu .nav-item').forEach((link) => {
    const ativo = link.dataset.tela === id;
    link.classList.toggle('ativo', ativo);
    if (ativo) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  $('#tituloTela').textContent = tela.titulo;
  $('#subtituloTela').textContent = id === 'painel'
    ? `Olá, ${usuario.nome.split(' ')[0]}. ${tela.subtitulo}`
    : tela.subtitulo;
  $('#btnNova').hidden = id !== 'painel' || !pode(usuario, 'criar');
  document.title = `${tela.titulo} · SpacFlow`;

  if (tela.desenhar) tela.desenhar($(`main [data-tela="${id}"]`), usuario);
}

export function iniciarNavegacao() {
  window.addEventListener('hashchange', () => mostrarTela());
  demandaRepository.inscrever(() => {
    const id = telaDoEndereco();
    if (id !== 'painel' && !$('#app').hidden) mostrarTela(id);
  });
}
