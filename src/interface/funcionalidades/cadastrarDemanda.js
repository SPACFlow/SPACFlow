// HISTÓRIA 1 — Cadastrar demanda
import { demandaRepository } from '../repositories/demandaRepository.js';
import { $, avisar } from '../utils/dom.js';

export function cadastrarDemanda({ titulo, descricao, solicitante, prazo }) {
  if (!titulo?.trim()) throw new Error('O título é obrigatório.');
  if (!solicitante?.trim()) throw new Error('O solicitante é obrigatório.');
  return demandaRepository.adicionar({
    id: demandaRepository.gerarId(),
    titulo: titulo.trim(),
    descricao: descricao?.trim() ?? '',
    solicitante: solicitante.trim(),
    prazo: prazo || null,
    status: 'Novo',
    prioridade: null,
    responsavel: null,
    numeroSei: null,
    criadaEm: new Date().toISOString(),
  });
}

export function iniciarCadastro() {
  document.body.insertAdjacentHTML('beforeend', `
    <dialog id="dlgNova">
      <form id="formNova" method="dialog">
        <h2>Nova demanda</h2>
        <label>Título *<input name="titulo" required></label>
        <label>Descrição<textarea name="descricao" rows="3"></textarea></label>
        <label>Solicitante *<input name="solicitante" required></label>
        <label>Prazo<input type="date" name="prazo"></label>
        <p class="erro" id="erroNova"></p>
        <div class="acoes">
          <button type="button" class="btn" id="cancelarNova">Cancelar</button>
          <button type="submit" class="btn primario">Cadastrar</button>
        </div>
      </form>
    </dialog>`);

  $('#btnNova').onclick = () => { $('#formNova').reset(); $('#erroNova').textContent = ''; $('#dlgNova').showModal(); };
  $('#cancelarNova').onclick = () => $('#dlgNova').close();
  $('#formNova').addEventListener('submit', (e) => {
    try {
      const d = cadastrarDemanda(Object.fromEntries(new FormData(e.target)));
      avisar(`Demanda #${d.id} cadastrada.`);
    } catch (erro) {
      e.preventDefault();
      $('#erroNova').textContent = erro.message;
    }
  });
}