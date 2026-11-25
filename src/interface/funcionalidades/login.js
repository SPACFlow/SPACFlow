import { CARGOS } from '../models/usuario.js';
import { armazenamento, sessaoAtual } from '../utils/armazenamento.js';
import { $, esc } from '../utils/dom.js';
import { campoComIcone, campoSenha, icones, ligarOlhos } from '../utils/icones.js';

const CHAVE_USUARIOS = 'spacflow:usuarios';
const CHAVE_SESSAO = 'spacflow:sessao';
const ITERACOES = 120000;
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const hex = (bytes) => [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');

async function gerarHash(senha, sal) {
  const chave = await crypto.subtle.importKey('raw', new TextEncoder().encode(senha), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(sal), iterations: ITERACOES }, chave, 256,
  );
  return hex(bits);
}

const lerUsuarios = () => armazenamento.ler(CHAVE_USUARIOS, []);
const gravarUsuarios = (lista) => armazenamento.gravar(CHAVE_USUARIOS, lista);
const publico = ({ id, nome, email, cargo, criadoEm }) => ({ id, nome, email, cargo, criadoEm });

export const listarUsuarios = () => lerUsuarios().map(publico);
export const existeUsuario = () => lerUsuarios().length > 0;

function validarDados({ nome, email, cargo }) {
  const limpo = { nome: String(nome ?? '').trim().replace(/\s+/g, ' '), email: String(email ?? '').trim().toLowerCase(), cargo };
  if (!limpo.nome) throw new Error('Informe o nome.');
  if (limpo.nome.length > 100) throw new Error('O nome deve ter no máximo 100 caracteres.');
  if (!FORMATO_EMAIL.test(limpo.email)) throw new Error('Informe um e-mail válido.');
  if (!CARGOS[cargo]) throw new Error('Escolha um cargo válido.');
  if (lerUsuarios().some((u) => u.email === limpo.email)) throw new Error('Já existe um usuário com esse e-mail.');
  return limpo;
}

function validarSenha(senha, confirmacao) {
  if (String(senha ?? '').length < 8) throw new Error('A senha precisa ter pelo menos 8 caracteres.');
  if (confirmacao !== undefined && senha !== confirmacao) throw new Error('A confirmação não é igual à senha.');
}

async function criarUsuario(dados, senha) {
  const sal = hex(crypto.getRandomValues(new Uint8Array(16)));
  const usuario = { id: hex(crypto.getRandomValues(new Uint8Array(8))), ...dados, sal, hash: await gerarHash(senha, sal), criadoEm: new Date().toISOString() };
  gravarUsuarios([...lerUsuarios(), usuario]);
  return publico(usuario);
}

export async function criarConta({ nome, email, senha, confirmacao }) {
  const cargo = existeUsuario() ? 'visualizador' : 'coordenador';
  const dados = validarDados({ nome, email, cargo });
  validarSenha(senha, confirmacao);
  const usuario = await criarUsuario(dados, senha);
  sessaoAtual.gravar(CHAVE_SESSAO, usuario.id);
  return usuario;
}

export async function entrar({ email, senha }) {
  const usuario = lerUsuarios().find((u) => u.email === String(email ?? '').trim().toLowerCase());
  const valida = usuario && (await gerarHash(String(senha ?? ''), usuario.sal)) === usuario.hash;
  if (!valida) throw new Error('E-mail ou senha incorretos.');
  sessaoAtual.gravar(CHAVE_SESSAO, usuario.id);
  return publico(usuario);
}

export function sair() {
  sessaoAtual.apagar(CHAVE_SESSAO);
}

export function usuarioAtual() {
  const id = sessaoAtual.ler(CHAVE_SESSAO, null);
  const usuario = id && lerUsuarios().find((u) => u.id === id);
  return usuario ? publico(usuario) : null;
}

function exigirCoordenacao(autor) {
  if (!autor || !CARGOS[autor.cargo]?.permissoes.includes('usuarios')) {
    throw new Error('Só a coordenação gerencia usuários.');
  }
}

export async function cadastrarUsuario({ nome, email, cargo, senha }, autor = usuarioAtual()) {
  exigirCoordenacao(autor);
  const dados = validarDados({ nome, email, cargo });
  validarSenha(senha);
  return criarUsuario(dados, senha);
}

export function alterarCargo(id, cargo, autor = usuarioAtual()) {
  exigirCoordenacao(autor);
  if (!CARGOS[cargo]) throw new Error('Escolha um cargo válido.');
  const lista = lerUsuarios();
  const usuario = lista.find((u) => u.id === id);
  if (!usuario) throw new Error('Usuário não encontrado.');
  const coordenadores = lista.filter((u) => u.cargo === 'coordenador');
  if (usuario.cargo === 'coordenador' && cargo !== 'coordenador' && coordenadores.length === 1) {
    throw new Error('O sistema precisa de pelo menos uma pessoa na coordenação.');
  }
  usuario.cargo = cargo;
  gravarUsuarios(lista);
  return publico(usuario);
}

export function removerUsuario(id, autor = usuarioAtual()) {
  exigirCoordenacao(autor);
  if (autor.id === id) throw new Error('Você não pode remover a sua própria conta.');
  const lista = lerUsuarios();
  if (!lista.some((u) => u.id === id)) throw new Error('Usuário não encontrado.');
  gravarUsuarios(lista.filter((u) => u.id !== id));
}

export async function redefinirSenha(id, nova, autor = usuarioAtual()) {
  exigirCoordenacao(autor);
  validarSenha(nova);
  const lista = lerUsuarios();
  const usuario = lista.find((u) => u.id === id);
  if (!usuario) throw new Error('Usuário não encontrado.');
  usuario.sal = hex(crypto.getRandomValues(new Uint8Array(16)));
  usuario.hash = await gerarHash(nova, usuario.sal);
  gravarUsuarios(lista);
}

export async function alterarSenha({ atual, nova, confirmacao }, autor = usuarioAtual()) {
  if (!autor) throw new Error('Entre no sistema para trocar a senha.');
  const lista = lerUsuarios();
  const usuario = lista.find((u) => u.id === autor.id);
  if ((await gerarHash(String(atual ?? ''), usuario.sal)) !== usuario.hash) throw new Error('A senha atual está incorreta.');
  validarSenha(nova, confirmacao);
  usuario.sal = hex(crypto.getRandomValues(new Uint8Array(16)));
  usuario.hash = await gerarHash(nova, usuario.sal);
  gravarUsuarios(lista);
}

const campoEmail = `<label>E-mail${campoComIcone('email', '<input name="email" type="email" autocomplete="email" required placeholder="voce@orgao.gov.br">')}</label>`;

function conteudo(modo, primeiroAcesso) {
  if (modo === 'criar') {
    return {
      titulo: primeiroAcesso ? 'Primeiro acesso' : 'Criar conta',
      subtitulo: primeiroAcesso
        ? 'Esta conta será a da coordenação da VISAT.'
        : 'A conta começa como Visualizador. A coordenação define o seu cargo.',
      campos: `
        <label>Nome completo${campoComIcone('pessoa', '<input name="nome" autocomplete="name" required maxlength="100" placeholder="Seu nome">')}</label>
        ${campoEmail}
        ${campoSenha('senha', 'Senha', 'new-password')}
        ${campoSenha('confirmacao', 'Confirmar senha', 'new-password')}`,
      botao: 'Criar conta e entrar',
      rodape: primeiroAcesso ? '' : 'Já tem uma conta? <button type="button" class="link" data-modo="entrar">Entrar.</button>',
    };
  }
  return {
    titulo: 'Bem-vindo de volta',
    subtitulo: 'Faça login na sua conta.',
    campos: `
      ${campoEmail}
      ${campoSenha('senha', 'Senha', 'current-password', '<button type="button" class="link" data-esqueci>Esqueceu sua senha?</button>')}`,
    botao: 'Entrar',
    rodape: 'Não tem uma conta? <button type="button" class="link" data-modo="criar">Crie uma.</button>',
  };
}

export function mostrarLogin(aoEntrar, modo = existeUsuario() ? 'entrar' : 'criar') {
  const tela = $('#telaLogin');
  const primeiroAcesso = !existeUsuario();
  const c = conteudo(modo, primeiroAcesso);
  tela.innerHTML = `
    <div class="login-caixa">
      <div class="login-icone">${icones.entrar}</div>
      <h1>${c.titulo}</h1>
      <p class="login-subtitulo">${c.subtitulo}</p>
      <form class="login-form" novalidate>
        ${c.campos}
        <p class="erro" role="alert"></p>
        <button type="submit" class="btn escuro largo">${c.botao}</button>
      </form>
      <p class="login-rodape">${c.rodape}</p>
      <p class="login-aviso">SpacFlow · VISAT Recife. Versão de demonstração: as contas e os dados ficam guardados só neste navegador.</p>
    </div>`;
  ligarOlhos(tela);
  tela.hidden = false;
  $('#app').hidden = true;
  document.title = 'Entrar · SpacFlow';

  const form = tela.querySelector('form');
  form.querySelector('input').focus();
  tela.querySelectorAll('[data-modo]').forEach((b) => b.addEventListener('click', () => mostrarLogin(aoEntrar, b.dataset.modo)));
  tela.querySelector('[data-esqueci]')?.addEventListener('click', () => {
    form.querySelector('.erro').textContent = 'Peça à coordenação da VISAT para redefinir a sua senha em Configurações.';
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const erro = form.querySelector('.erro');
    const botao = form.querySelector('button[type="submit"]');
    erro.textContent = '';
    botao.disabled = true;
    try {
      const dados = Object.fromEntries(new FormData(form));
      const usuario = modo === 'criar' ? await criarConta(dados) : await entrar(dados);
      tela.hidden = true;
      tela.innerHTML = '';
      aoEntrar(usuario);
    } catch (falha) {
      erro.textContent = falha.message;
      botao.disabled = false;
    }
  });
}

export function desenharUsuarioLogado(usuario, aoSair) {
  const el = $('#usuarioLogado');
  el.innerHTML = `
    <div><strong>${esc(usuario.nome)}</strong><small>${esc(CARGOS[usuario.cargo]?.nome ?? '')}</small></div>
    <button class="btn-sair" type="button" aria-label="Sair do sistema" title="Sair">${icones.sair}</button>`;
  el.querySelector('.btn-sair').addEventListener('click', () => { sair(); aoSair(); });
}
