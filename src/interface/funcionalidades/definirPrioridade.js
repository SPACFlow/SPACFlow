import { demandaRepository } from '../repositories/demandaRepository.js';
import { PRIORIDADES } from '../models/demanda.js';
import { registrarSecao } from '../componentes/detalhe.js';
import { avisar, opcoes } from '../utils/dom.js';

export function definirPrioridade(id, prioridade) {
  if (prioridade && !PRIORIDADES.includes(prioridade)) throw new Error('Prioridade inválida.');
  const demanda = demandaRepository.buscarPorId(id);
  if (!demanda) throw new Error('Demanda não encontrada.');
  demanda.prioridade = prioridade || null; // vazio = remove a prioridade
  demandaRepository.notificar();
  return demanda;
}

export function iniciarDefinirPrioridade() {
  registrarSecao((el, demanda) => {
    el.innerHTML = `<label>Prioridade<select>${opcoes(PRIORIDADES, 'Sem prioridade')}</select></label>`;
    const campo = el.querySelector('select');
    campo.value = demanda.prioridade ?? '';
    campo.addEventListener('change', () => {
      try {
        const d = definirPrioridade(demanda.id, campo.value);
        avisar(d.prioridade ? `Prioridade ${d.prioridade} definida.` : 'Prioridade removida.');
      } catch (erro) {
        campo.value = demanda.prioridade ?? '';
        avisar(erro.message);
      }
    });
  });
}
