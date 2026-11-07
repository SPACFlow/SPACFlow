// HISTÓRIA 10 — Registrar referência do processo SEI
import { demandaRepository } from '../repositories/demandaRepository.js';
import { registrarSecao } from '../componentes/detalhe.js';
import { avisar, esc } from '../utils/dom.js';

// Exemplo: 8918.461/2026-70 (4 ou 5 dígitos . 3 a 6 dígitos / ano - 2 dígitos)
const FORMATO_SEI = /^\d{4,5}\.\d{3,6}\/\d{4}-\d{2}$/;

export function registrarSei(id, numero) {
  const limpo = numero?.trim().replace(/^SEI\s*/i, '');
  if (!limpo) throw new Error('Informe o número do processo SEI.');
  if (!FORMATO_SEI.test(limpo)) throw new Error('Número inválido. Exemplo: 8918.461/2026-70');

  const demanda = demandaRepository.buscarPorId(id);
  if (!demanda) throw new Error('Demanda não encontrada.');

  const repetido = demandaRepository.listar().some((d) => d.numeroSei === limpo && d.id !== demanda.id);
  if (repetido) throw new Error('Esse processo SEI já está registrado em outra demanda.');

  demanda.numeroSei = limpo;
  demandaRepository.notificar();
  return demanda;
}

export function iniciarRegistrarSei() {
  registrarSecao((el, demanda) => {
    el.innerHTML = `<label>Processo SEI<input type="text" placeholder="8918.461/2026-70" value="${esc(demanda.numeroSei ?? '')}"></label>`;
    const campo = el.querySelector('input');
    campo.addEventListener('change', () => {
      try {
        const d = registrarSei(demanda.id, campo.value);
        campo.value = d.numeroSei;
        avisar(`Processo SEI ${d.numeroSei} registrado.`);
      } catch (erro) {
        campo.value = demanda.numeroSei ?? '';
        avisar(erro.message);
      }
    });
  });
}
