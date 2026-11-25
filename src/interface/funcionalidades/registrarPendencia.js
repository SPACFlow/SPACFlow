import { registrarSecao, abrirDetalhe } from '../componentes/detalhe.js';
import { demandaRepository } from '../repositories/demandaRepository.js';
import { STATUS_FINAIS } from '../models/demanda.js';
import { pode } from '../models/usuario.js';
import { usuarioAtual } from './login.js';
import { $, esc, avisar } from '../utils/dom.js';

const LIMITE = 200;

async function buscar(id) {
  const demanda = await demandaRepository.buscarPorId(id);
  if (!demanda) throw new Error(`Demanda #${id} não encontrada.`);
  return demanda;
}

export async function registrarPendencia({ id, descricao, autor }) {
  const demanda = await buscar(id);
  if (STATUS_FINAIS.includes(demanda.status)) {
    throw new Error(`A demanda #${demanda.id} está ${demanda.status.toLowerCase()} e não recebe pendência nova.`);
  }
  const texto = String(descricao ?? '').trim();
  if (!texto) throw new Error('Descreva a pendência ou o impedimento.');
  if (texto.length > LIMITE) throw new Error(`A pendência deve ter no máximo ${LIMITE} caracteres.`);
  const por = String(autor ?? '').trim();
  if (!por) throw new Error('Informe quem está registrando a pendência.');

  const pendencias = demanda.pendencias ?? [];
  const pendencia = { numero: pendencias.length + 1, descricao: texto, por, em: new Date().toISOString(), resolvidaEm: null };
  await demandaRepository.atualizar(demanda.id, { pendencias: [...pendencias, pendencia] });
  return pendencia;
}

export async function resolverPendencia({ id, numero }) {
  const demanda = await buscar(id);
  const pendencias = (demanda.pendencias ?? []).map((p) => ({ ...p }));
  const pendencia = pendencias.find((p) => p.numero === Number(numero));
  if (!pendencia) throw new Error(`A demanda #${demanda.id} não tem a pendência ${numero}.`);
  if (pendencia.resolvidaEm) throw new Error(`A pendência ${pendencia.numero} já está resolvida.`);
  pendencia.resolvidaEm = new Date().toISOString();
  await demandaRepository.atualizar(demanda.id, { pendencias });
  return pendencia;
}

const dataHora = (iso) => new Date(iso).toLocaleDateString('pt-BR');

function desenhar(el, d) {
  const usuario = usuarioAtual();
  const podeRegistrar = pode(usuario, 'pendencia') && !STATUS_FINAIS.includes(d.status);
  const pendencias = d.pendencias ?? [];
  const abertas = pendencias.filter((p) => !p.resolvidaEm).length;

  el.className = 'secao-detalhe';
  el.innerHTML = `
    <h3>Pendências</h3>
    <p class="secao-situacao${abertas ? ' alerta' : ''}">${pendencias.length
      ? `${abertas} em aberto de ${pendencias.length}`
      : 'Nenhuma pendência registrada'}</p>
    ${pendencias.length ? `<ol class="pendencias">${pendencias.map((p) => `
      <li class="${p.resolvidaEm ? 'resolvida' : ''}">
        <span>${esc(p.descricao)}<small>${esc(p.por)}, ${dataHora(p.em)}${p.resolvidaEm ? ` · resolvida em ${dataHora(p.resolvidaEm)}` : ''}</small></span>
        ${!p.resolvidaEm && podeRegistrar ? `<button type="button" class="btn pequeno" data-resolver="${p.numero}">Marcar como resolvida</button>` : ''}
      </li>`).join('')}</ol>` : ''}
    ${podeRegistrar ? `
    <form class="secao-form" novalidate>
      <label>Nova pendência ou impedimento
        <input name="descricao" maxlength="${LIMITE}" placeholder="Ex.: aguardando documento do MPT" required>
      </label>
      <button type="submit" class="btn primario">Registrar</button>
    </form>
    <p class="erro" role="alert"></p>` : ''}`;

  const reabrir = () => { $('#dlgDetalhe').close(); abrirDetalhe(d.id); };
  el.querySelector('form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const p = await registrarPendencia({ id: d.id, descricao: e.target.descricao.value, autor: usuario.nome });
      avisar(`Pendência ${p.numero} registrada na demanda #${d.id}.`);
      reabrir();
    } catch (falha) {
      el.querySelector('.erro').textContent = falha.message;
    }
  });
  el.querySelectorAll('[data-resolver]').forEach((b) => b.addEventListener('click', async () => {
    try {
      await resolverPendencia({ id: d.id, numero: b.dataset.resolver });
      avisar(`Pendência ${b.dataset.resolver} marcada como resolvida.`);
      reabrir();
    } catch (falha) {
      avisar(falha.message);
    }
  }));
}

export function iniciarRegistrarPendencia() {
  registrarSecao(desenhar);
}
