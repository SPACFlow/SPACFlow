import { demandaRepository } from '../repositories/demandaRepository.js';
import { registrarFiltro } from '../componentes/filtros.js';

// Ignora maiúsculas e acentos: "analise" encontra "Análise".
const normalizar = (t) => String(t ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function combinaComBusca(demanda, termo) {
  const busca = normalizar(termo).trim();
  return !busca || [demanda.titulo, demanda.descricao, demanda.solicitante, demanda.responsavel, demanda.numeroSei]
    .some((campo) => normalizar(campo).includes(busca));
}

export function pesquisarDemandas(termo) {
  return demandaRepository.listar().filter((d) => combinaComBusca(d, termo));
}

export function iniciarPesquisa() {
  registrarFiltro(
    (el, aoAlterar) => {
      el.classList.add('filtro-busca');
      el.innerHTML = '<input type="search" placeholder="Buscar por título, solicitante, responsável ou SEI…" aria-label="Pesquisar demandas">';
      el.querySelector('input').addEventListener('input', (e) => aoAlterar(e.target.value));
    },
    combinaComBusca,
  );
}
