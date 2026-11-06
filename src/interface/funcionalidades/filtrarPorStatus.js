import { STATUS } from '../models/demanda.js';
import { registrarFiltro } from '../componentes/filtros.js';
import { opcoes } from '../utils/dom.js';

export function combinaComStatus(demanda, status) {
  return !status || demanda.status === status;
}

export function iniciarFiltroStatus() {
  registrarFiltro(
    (el, aoAlterar) => {
      el.innerHTML = `<select aria-label="Filtrar por status">${opcoes(STATUS, 'Todos os status')}</select>`;
      el.querySelector('select').addEventListener('input', (e) => aoAlterar(e.target.value));
    },
    combinaComStatus,
  );
}
