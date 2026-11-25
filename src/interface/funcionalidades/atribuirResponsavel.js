import { demandaRepository } from '../repositories/demandaRepository.js';
import { RESPONSAVEIS } from '../models/demanda.js';
import { registrarSecao, abrirDetalhe } from '../componentes/detalhe.js';
import { $, avisar, opcoes, esc } from '../utils/dom.js';
import { pode } from '../models/usuario.js';
import { usuarioAtual, listarUsuarios } from './login.js';

export const responsaveisPossiveis = () =>
  [...new Set([...listarUsuarios().filter((u) => u.cargo !== 'visualizador').map((u) => u.nome), ...RESPONSAVEIS])];

export function atribuirResponsavel(id, responsavel) {
  if (responsavel && !responsaveisPossiveis().includes(responsavel)) throw new Error('Responsável inválido.');
  const demanda = demandaRepository.buscarPorId(id);
  if (!demanda) throw new Error('Demanda não encontrada.');
  demanda.responsavel = responsavel || null;
  demandaRepository.notificar();
  return demanda;
}

export function iniciarAtribuirResponsavel() {
  registrarSecao((el, demanda) => {
    el.className = 'secao-detalhe';
    if (!pode(usuarioAtual(), 'responsavel')) {
      el.innerHTML = `<h3>Responsável</h3><p class="secao-situacao">${esc(demanda.responsavel ?? 'Não atribuído')}</p>`;
      return;
    }
    el.innerHTML = `<h3>Responsável</h3><label class="sr-only" for="campoResponsavel">Responsável</label><select id="campoResponsavel">${opcoes(responsaveisPossiveis(), 'Não atribuído')}</select>`;
    const campo = el.querySelector('select');
    campo.value = demanda.responsavel ?? '';
    campo.addEventListener('change', () => {
      try {
        const d = atribuirResponsavel(demanda.id, campo.value);
        avisar(d.responsavel ? `Demanda atribuída a ${d.responsavel}.` : 'Responsável removido.');
        $('#dlgDetalhe').close();
        abrirDetalhe(d.id);
      } catch (erro) {
        campo.value = demanda.responsavel ?? '';
        avisar(erro.message);
      }
    });
  });
}
