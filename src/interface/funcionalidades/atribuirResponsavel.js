// HISTÓRIA 5 — Atribuir responsável
import { demandaRepository } from '../repositories/demandaRepository.js';
import { RESPONSAVEIS } from '../models/demanda.js';
import { registrarSecao } from '../componentes/detalhe.js';
import { avisar, opcoes } from '../utils/dom.js';

export function atribuirResponsavel(id, responsavel) {
  if (responsavel && !RESPONSAVEIS.includes(responsavel)) throw new Error('Responsável inválido.');
  const demanda = demandaRepository.buscarPorId(id);
  if (!demanda) throw new Error('Demanda não encontrada.');
  demanda.responsavel = responsavel || null; // vazio = deixa sem responsável
  demandaRepository.notificar();
  return demanda;
}

export function iniciarAtribuirResponsavel() {
  registrarSecao((el, demanda) => {
    el.innerHTML = `<label>Responsável<select>${opcoes(RESPONSAVEIS, 'Não atribuído')}</select></label>`;
    const campo = el.querySelector('select');
    campo.value = demanda.responsavel ?? '';
    campo.addEventListener('change', () => {
      try {
        const d = atribuirResponsavel(demanda.id, campo.value);
        avisar(d.responsavel ? `Demanda atribuída a ${d.responsavel}.` : 'Responsável removido.');
      } catch (erro) {
        campo.value = demanda.responsavel ?? '';
        avisar(erro.message);
      }
    });
  });
}
