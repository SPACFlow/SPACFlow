import { demandaRepository } from '../repositories/demandaRepository.js';
import { CARGOS, nomeDoCargo, pode } from '../models/usuario.js';
import { registrarTela, mostrarTela } from '../componentes/navegacao.js';
import { esc, avisar } from '../utils/dom.js';
import { icones, campoSenha, ligarOlhos } from '../utils/icones.js';
import {
  listarUsuarios, cadastrarUsuario, alterarCargo, removerUsuario, redefinirSenha, alterarSenha,
} from './login.js';

const opcoesCargo = (selecionado) =>
  Object.entries(CARGOS).map(([id, c]) => `<option value="${id}" ${id === selecionado ? 'selected' : ''}>${esc(c.nome)}</option>`).join('');

const blocoPerfil = (usuario) => `
  <section class="painel-relatorio">
    <header><h2>Meu perfil</h2></header>
    <dl class="perfil">
      <div><dt>Nome</dt><dd>${esc(usuario.nome)}</dd></div>
      <div><dt>E-mail</dt><dd>${esc(usuario.email)}</dd></div>
      <div><dt>Cargo</dt><dd>${esc(nomeDoCargo(usuario.cargo))}</dd></div>
    </dl>
    <details class="trocar-senha">
      <summary>Trocar minha senha</summary>
      <form data-form="senha" novalidate>
        ${campoSenha('atual', 'Senha atual', 'current-password')}
        ${campoSenha('nova', 'Nova senha', 'new-password')}
        ${campoSenha('confirmacao', 'Confirmar nova senha', 'new-password')}
        <p class="erro" role="alert"></p>
        <button type="submit" class="btn primario">Salvar nova senha</button>
      </form>
    </details>
  </section>`;

const blocoCadastro = () => `
  <section class="painel-relatorio">
    <header><h2 class="com-icone">${icones.usuarioMais}Cadastrar usuário por cargo</h2>
      <p>A pessoa entra com o e-mail e a senha provisória, e pode trocar a senha em Configurações.</p></header>
    <form class="form-usuario" data-form="usuario" novalidate>
      <label>Nome<input name="nome" required maxlength="100" autocomplete="off"></label>
      <label>E-mail<input name="email" type="email" required placeholder="email@orgao.gov.br" autocomplete="off"></label>
      <label>Cargo<select name="cargo">${opcoesCargo('tecnico')}</select></label>
      ${campoSenha('senha', 'Senha provisória', 'new-password')}
      <button type="submit" class="btn primario">Cadastrar usuário</button>
      <p class="erro" role="alert"></p>
    </form>
    <ul class="cargos">${Object.values(CARGOS).map((c) => `
      <li><strong>${esc(c.nome)}</strong><ul>${c.resumo.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></li>`).join('')}
    </ul>
  </section>`;

const blocoEquipe = (usuario) => {
  const usuarios = listarUsuarios();
  return `
  <section class="painel-relatorio">
    <header><h2>Equipe <em>${usuarios.length}</em></h2></header>
    <ul class="equipe">${usuarios.map((u) => `
      <li data-id="${u.id}">
        <div class="pessoa"><span class="avatar" aria-hidden="true">${esc(u.nome.slice(0, 1).toUpperCase())}</span>
          <div><strong>${esc(u.nome)}${u.id === usuario.id ? ' <small>(você)</small>' : ''}</strong><span>${esc(u.email)}</span></div></div>
        <label class="sr-only" for="cargo-${u.id}">Cargo de ${esc(u.nome)}</label>
        <select id="cargo-${u.id}" data-cargo>${opcoesCargo(u.cargo)}</select>
        <details class="redefinir">
          <summary>Redefinir senha</summary>
          <form data-form="redefinir" novalidate>
            ${campoSenha('nova', `Nova senha de ${esc(u.nome.split(' ')[0])}`, 'new-password')}
            <button type="submit" class="btn primario">Salvar</button>
            <p class="erro" role="alert"></p>
          </form>
        </details>
        ${u.id === usuario.id ? '' : '<button type="button" class="btn perigo" data-remover>Remover</button>'}
      </li>`).join('')}
    </ul>
  </section>`;
};

const blocoBackup = () => `
  <section class="painel-relatorio">
    <header class="com-selo"><span class="selo">${icones.escudo}</span>
      <div><h2>Backup e cópia de segurança</h2><p>${demandaRepository.listar().length} demandas guardadas neste navegador. Baixe uma cópia antes de limpar o navegador ou trocar de computador.</p></div></header>
    <div class="acoes-backup">
      <button type="button" class="btn primario" data-baixar>Baixar cópia (.json)</button>
      <label class="btn">Restaurar de um arquivo<input type="file" accept="application/json,.json" data-restaurar hidden></label>
      <button type="button" class="btn" data-exemplos>Voltar às demandas de exemplo</button>
    </div>
    <p class="erro" role="alert" data-erro-backup></p>
  </section>`;

function ligarEventos(el, usuario) {
  ligarOlhos(el);
  const redesenhar = () => mostrarTela('configuracoes');

  el.querySelector('[data-form="senha"]').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      await alterarSenha(Object.fromEntries(new FormData(form)));
      avisar('Senha alterada.');
      redesenhar();
    } catch (falha) {
      form.querySelector('.erro').textContent = falha.message;
    }
  });

  el.querySelector('[data-form="usuario"]')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      const novo = await cadastrarUsuario(Object.fromEntries(new FormData(form)));
      avisar(`${novo.nome} cadastrado(a) como ${nomeDoCargo(novo.cargo)}.`);
      redesenhar();
    } catch (falha) {
      form.querySelector('.erro').textContent = falha.message;
    }
  });

  el.querySelectorAll('.equipe > li').forEach((item) => {
    const id = item.dataset.id;
    const select = item.querySelector('[data-cargo]');
    select.addEventListener('change', () => {
      try {
        const alterado = alterarCargo(id, select.value);
        avisar(`${alterado.nome} agora é ${nomeDoCargo(alterado.cargo)}.`);
        redesenhar();
      } catch (falha) {
        avisar(falha.message);
        redesenhar();
      }
    });
    item.querySelector('[data-form="redefinir"]').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await redefinirSenha(id, e.target.nova.value);
        avisar('Senha redefinida. Avise a pessoa da nova senha.');
        redesenhar();
      } catch (falha) {
        e.target.querySelector('.erro').textContent = falha.message;
      }
    });
    item.querySelector('[data-remover]')?.addEventListener('click', () => {
      const nome = item.querySelector('strong').textContent;
      if (!confirm(`Remover o acesso de ${nome}? A pessoa não vai mais conseguir entrar.`)) return;
      try {
        removerUsuario(id);
        avisar(`Acesso de ${nome} removido.`);
        redesenhar();
      } catch (falha) {
        avisar(falha.message);
      }
    });
  });

  el.querySelector('[data-baixar]')?.addEventListener('click', () => {
    const arquivo = new Blob([JSON.stringify(demandaRepository.exportar(), null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(arquivo);
    link.download = `spacflow-demandas-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  });
  el.querySelector('[data-restaurar]')?.addEventListener('change', async (e) => {
    const erro = el.querySelector('[data-erro-backup]');
    try {
      const lista = JSON.parse(await e.target.files[0].text());
      if (!confirm(`Substituir as demandas deste navegador pelas ${lista.length} do arquivo?`)) return;
      demandaRepository.restaurar(lista);
      avisar('Cópia restaurada.');
      redesenhar();
    } catch (falha) {
      erro.textContent = falha instanceof SyntaxError ? 'O arquivo não é um JSON válido.' : falha.message;
    }
  });
  el.querySelector('[data-exemplos]')?.addEventListener('click', () => {
    if (!confirm('Apagar as demandas deste navegador e voltar às 5 demandas de exemplo?')) return;
    demandaRepository.restaurarExemplos();
    avisar('Demandas de exemplo restauradas.');
    redesenhar();
  });
}

function desenhar(el, usuario) {
  el.innerHTML = `
    <div class="configuracoes">
      ${blocoPerfil(usuario)}
      ${pode(usuario, 'usuarios') ? blocoCadastro() + blocoEquipe(usuario) : ''}
      ${pode(usuario, 'backup') ? blocoBackup() : ''}
    </div>`;
  ligarEventos(el, usuario);
}

export function iniciarConfiguracoes() {
  registrarTela('configuracoes', {
    titulo: 'Configurações',
    subtitulo: 'Seu perfil, a equipe e a cópia de segurança dos dados.',
    desenhar,
  });
}
