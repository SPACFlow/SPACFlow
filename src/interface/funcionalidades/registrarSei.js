import { registrarSecao, abrirDetalhe } from '../componentes/detalhe.js';
import { demandaRepository } from '../repositories/demandaRepository.js';
import { $, esc, avisar } from '../utils/dom.js';
import { pode } from '../models/usuario.js';
import { usuarioAtual } from './login.js';

const FORMATO_SEI = /^\d{4,5}\.\d{3,6}\/(\d{4})-\d{2}$/;
export const EXEMPLO_SEI = '8918.461/2026-70';

export function limparNumeroSei(numero) {
  return String(numero ?? '').trim().replace(/^SEI\s*(n[º°.]\s*)?/i, '').trim();
}

export function validarNumeroSei(numero, anoAtual = new Date().getFullYear()) {
  const limpo = limparNumeroSei(numero);
  if (!limpo) throw new Error('Informe o número do processo SEI.');

  const formato = FORMATO_SEI.exec(limpo);
  if (!formato) throw new Error(`Número do SEI inválido. Use o formato ${EXEMPLO_SEI}.`);
  if (Number(formato[1]) > anoAtual) throw new Error('O ano do processo SEI não pode ser maior que o ano atual.');
  return limpo;
}

async function salvar(id, alteracoes) {
  if (typeof demandaRepository.atualizar === 'function') {
    const atualizada = await demandaRepository.atualizar(id, alteracoes);
    demandaRepository.notificar?.();
    return atualizada;
  }
  const demanda = await demandaRepository.buscarPorId(id);
  Object.assign(demanda, alteracoes);
  demandaRepository.notificar();
  return demanda;
}

export async function registrarSei(id, numero) {
  const demanda = await demandaRepository.buscarPorId(id);
  if (!demanda) throw new Error(`Demanda #${id} não encontrada.`);

  const numeroSei = validarNumeroSei(numero);
  if (demanda.numeroSei === numeroSei) throw new Error(`A demanda #${demanda.id} já está vinculada ao SEI ${numeroSei}.`);

  const outra = (await demandaRepository.listar()).find((d) => d.id !== demanda.id && d.numeroSei === numeroSei);
  if (outra) throw new Error(`O SEI ${numeroSei} já está registrado na demanda #${outra.id}.`);

  const anterior = demanda.numeroSei ?? null;
  return { demanda: await salvar(demanda.id, { numeroSei }), anterior };
}

function desenhar(el, d) {
  el.className = 'secao-detalhe';
  el.innerHTML = `
    <h3>Processo SEI</h3>
    <p class="secao-situacao">${d.numeroSei ? `Vinculada ao SEI <b>${esc(d.numeroSei)}</b>` : 'Nenhum processo SEI vinculado'}</p>
    ${!pode(usuarioAtual(), 'sei') ? '<p class="secao-dica">Só a coordenação e o administrativo vinculam o processo SEI.</p>' : `
    <form class="secao-form" novalidate>
      <label>${d.numeroSei ? 'Novo número SEI' : 'Número do processo SEI'}
        <input name="numeroSei" value="${esc(d.numeroSei ?? '')}" placeholder="${EXEMPLO_SEI}" autocomplete="off" spellcheck="false" required>
      </label>
      <button type="submit" class="btn primario">${d.numeroSei ? 'Alterar SEI' : 'Vincular SEI'}</button>
    </form>
    <p class="secao-dica">Formato: ${EXEMPLO_SEI}. Um mesmo SEI não pode ficar em duas demandas.</p>
    <p class="erro" role="alert"></p>`}`;

  const form = el.querySelector('form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const erro = el.querySelector('.erro');
    erro.textContent = '';
    try {
      const { demanda, anterior } = await registrarSei(d.id, form.numeroSei.value);
      avisar(anterior
        ? `SEI da demanda #${demanda.id} alterado de ${anterior} para ${demanda.numeroSei}.`
        : `Demanda #${demanda.id} vinculada ao SEI ${demanda.numeroSei}.`);
      $('#dlgDetalhe').close();
      abrirDetalhe(demanda.id);
    } catch (falha) {
      erro.textContent = falha.message;
    }
  });
}

export function iniciarRegistrarSei() {
  registrarSecao(desenhar);
}
