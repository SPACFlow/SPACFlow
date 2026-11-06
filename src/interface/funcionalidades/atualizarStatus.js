import { demandaRepository } from '../repositories/demandaRepository.js';
import { STATUS } from '../models/demanda.js';
import { registrarSecao } from '../componentes/detalhe.js';
import { avisar, opcoes } from '../utils/dom.js';

export function atualizarStatus(id, status) {
  if (!STATUS.includes(status)) throw new Error('Status inválido.');
  const demanda = demandaRepository.buscarPorId(id);
  if (!demanda) throw new Error('Demanda não encontrada.');
  demanda.status = status;
  demandaRepository.notificar();
  return demanda;
}

export function iniciarAtualizarStatus() {
  registrarSecao((el, demanda) => {
    el.innerHTML = `<label>Status<select>${opcoes(STATUS)}</select></label>`;
    const campo = el.querySelector('select');
    campo.value = demanda.status;
    campo.addEventListener('change', () => {
      try {
        atualizarStatus(demanda.id, campo.value);
        avisar(`Status alterado para "${campo.value}".`);
      } catch (erro) {
        campo.value = demanda.status;
        avisar(erro.message);
      }
    });
  });
}