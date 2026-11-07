// HISTÓRIA 6 — Definir prazo
import { demandaRepository } from '../repositories/demandaRepository.js';
import { registrarSecao } from '../componentes/detalhe.js';
import { avisar, dataBR } from '../utils/dom.js';

// prazoISO vem do campo de data no formato AAAA-MM-DD.
function dataValida(prazoISO) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(prazoISO ?? '')) return false;
  const [ano, mes, dia] = prazoISO.split('-').map(Number);
  const d = new Date(ano, mes - 1, dia);
  return d.getFullYear() === ano && d.getMonth() === mes - 1 && d.getDate() === dia;
}

export function definirPrazo(id, prazoISO) {
  if (!dataValida(prazoISO)) throw new Error('Informe uma data válida.');
  const demanda = demandaRepository.buscarPorId(id);
  if (!demanda) throw new Error('Demanda não encontrada.');
  demanda.prazo = prazoISO;
  demandaRepository.notificar();
  return demanda;
}

export function iniciarDefinirPrazo() {
  registrarSecao((el, demanda) => {
    el.innerHTML = `<label>Prazo<input type="date" value="${demanda.prazo ?? ''}"></label>`;
    const campo = el.querySelector('input');
    campo.addEventListener('change', () => {
      try {
        definirPrazo(demanda.id, campo.value);
        avisar(`Prazo definido para ${dataBR(campo.value)}.`);
      } catch (erro) {
        campo.value = demanda.prazo ?? '';
        avisar(erro.message);
      }
    });
  });
}
