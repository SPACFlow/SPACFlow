import { registrarSecao, abrirDetalhe } from '../componentes/detalhe.js';
import { demandaRepository } from '../repositories/demandaRepository.js';
import { STATUS_FINAIS } from '../models/demanda.js';
import { pode } from '../models/usuario.js';
import { usuarioAtual } from './login.js';
import { $, esc, avisar } from '../utils/dom.js';

const LIMITE = 500;
const normalizar = (t) => String(t ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').trim().replace(/\s+/g, ' ').toLowerCase();

export async function concluirDemanda({ id, responsavel, resultado }) {
  const demanda = await demandaRepository.buscarPorId(id);
  if (!demanda) throw new Error(`Demanda #${id} não encontrada.`);
  if (STATUS_FINAIS.includes(demanda.status)) throw new Error(`A demanda #${demanda.id} já está ${demanda.status.toLowerCase()}.`);
  if (!demanda.responsavel) throw new Error('Atribua um responsável antes de concluir a demanda.');
  if (normalizar(demanda.responsavel) !== normalizar(responsavel)) {
    throw new Error(`Só ${demanda.responsavel}, responsável pela demanda, pode concluí-la.`);
  }
  const texto = String(resultado ?? '').trim();
  if (!texto) throw new Error('Descreva o resultado: o parecer ou a resposta enviada ao órgão.');
  if (texto.length > LIMITE) throw new Error(`O resultado deve ter no máximo ${LIMITE} caracteres.`);

  const agora = new Date().toISOString();
  const historicoStatus = [...(demanda.historicoStatus ?? []), { de: demanda.status, para: 'Concluída', por: demanda.responsavel, em: agora }];
  return demandaRepository.atualizar(demanda.id, { status: 'Concluída', resultado: texto, concluidaEm: agora, historicoStatus });
}

function desenhar(el, d) {
  el.className = 'secao-detalhe';
  if (d.status === 'Concluída' && d.resultado) {
    el.innerHTML = `
      <h3>Resultado</h3>
      <p class="secao-situacao">Concluída em ${new Date(d.concluidaEm).toLocaleDateString('pt-BR')} por ${esc(d.responsavel ?? '')}</p>
      <p class="resultado">${esc(d.resultado)}</p>`;
    return;
  }
  if (STATUS_FINAIS.includes(d.status)) { el.hidden = true; return; }

  const usuario = usuarioAtual();
  const ehResponsavel = d.responsavel && normalizar(d.responsavel) === normalizar(usuario?.nome);
  if (!pode(usuario, 'concluir') || !ehResponsavel) {
    el.innerHTML = `<h3>Concluir demanda</h3><p class="secao-dica">${d.responsavel
      ? `Só ${esc(d.responsavel)}, responsável pela demanda, pode concluí-la registrando o resultado.`
      : 'Atribua um responsável para que a demanda possa ser concluída.'}</p>`;
    return;
  }

  el.innerHTML = `
    <h3>Concluir demanda</h3>
    <form class="secao-form coluna" novalidate>
      <label>Resultado (parecer ou resposta enviada ao órgão)
        <textarea name="resultado" rows="3" maxlength="${LIMITE}" required></textarea>
      </label>
      <button type="submit" class="btn primario">Concluir demanda</button>
    </form>
    <p class="erro" role="alert"></p>`;
  el.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const demanda = await concluirDemanda({ id: d.id, responsavel: usuario.nome, resultado: e.target.resultado.value });
      avisar(`Demanda #${demanda.id} concluída.`);
      $('#dlgDetalhe').close();
      abrirDetalhe(demanda.id);
    } catch (falha) {
      el.querySelector('.erro').textContent = falha.message;
    }
  });
}

export function iniciarConcluirDemanda() {
  registrarSecao(desenhar);
}
