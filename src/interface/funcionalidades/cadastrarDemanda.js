// HISTÓRIA 1 — Cadastrar demanda
import { demandaRepository } from '../repositories/demandaRepository.js';
import { ORIGENS, CATEGORIAS } from '../models/demanda.js';
import { $, avisar, opcoes } from '../utils/dom.js';

export function cadastrarDemanda({ titulo, descricao, solicitante, origem, categoria, prazo }) {
  if (!titulo?.trim()) throw new Error('O título é obrigatório.');
  if (titulo.trim().length > 150) throw new Error('O título deve ter no máximo 150 caracteres.');
  if (!solicitante?.trim()) throw new Error('O solicitante é obrigatório.');
  if (!ORIGENS.includes(origem)) throw new Error('Escolha a origem da demanda.');
  if (!CATEGORIAS.includes(categoria)) throw new Error('Escolha a categoria da demanda.');
  return demandaRepository.adicionar({
    id: demandaRepository.gerarId(),
    titulo: titulo.trim(),
    descricao: descricao?.trim() ?? '',
    solicitante: solicitante.trim(),
    origem,
    categoria,
    prazo: prazo || null,
    status: 'Pendente',
    prioridade: null,
    responsavel: null,
    numeroSei: null,
    historicoStatus: [],
    pendencias: [],
    resultado: null,
    concluidaEm: null,
    criadaEm: new Date().toISOString(),
  });
}

export function iniciarCadastro() {
  document.body.insertAdjacentHTML('beforeend', `
    <dialog id="dlgNova">
      <form id="formNova" method="dialog">
        <h2>Nova demanda</h2>
        <label>Título *<input name="titulo" required maxlength="150"></label>
        <label>Descrição<textarea name="descricao" rows="3"></textarea></label>
        <label>Solicitante *<input name="solicitante" required></label>
        <label>Origem *<select name="origem" required>${opcoes(ORIGENS, 'Escolha a origem')}</select></label>
        <label>Categoria *<select name="categoria" required>${opcoes(CATEGORIAS, 'Escolha a categoria')}</select></label>
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
