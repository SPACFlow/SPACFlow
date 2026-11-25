import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(__dirname, '../..');
const pastaDados = process.env.SPACFLOW_DATABASE ? path.resolve(process.env.SPACFLOW_DATABASE) : path.join(raiz, 'database');
const arquivoDemandas = path.join(pastaDados, 'demandas.json');
const arquivoUsuarios = path.join(pastaDados, 'usuarios.json');
const interfaceDir = path.join(raiz, 'src/interface');
const sessoes = new Map();

// Uma requisição da API por vez: sem isso, dois pedidos simultâneos leem o mesmo JSON
// e um apaga a gravação do outro (perda de dados).
let fila = Promise.resolve();
const emSerie = (tarefa) => { const resultado = fila.then(tarefa); fila = resultado.catch(() => {}); return resultado; };
const PORTA = Number(process.env.PORT || 3000);

const STATUS = ['Pendente', 'Em andamento', 'Concluída', 'Cancelada'];
const PRIORIDADES = ['Baixa', 'Média', 'Alta', 'Urgente'];
const ORIGENS = ['Ministério Público', 'Prefeitura', 'Ouvidoria', 'Secretaria de Saúde', 'Outro órgão'];
const CATEGORIAS = ['Acidente de trabalho', 'Doença relacionada ao trabalho', 'Inspeção de ambiente de trabalho', 'Parecer técnico', 'Outros'];

async function lerJSON(arquivo, padrao) {
  try { return JSON.parse(await readFile(arquivo, 'utf8')); }
  catch (e) {
    if (e.code === 'ENOENT') return padrao;
    throw e;
  }
}
async function salvarJSON(arquivo, dados) {
  await mkdir(pastaDados, { recursive: true });
  const temporario = `${arquivo}.tmp`;
  await writeFile(temporario, JSON.stringify(dados, null, 2) + '\n', 'utf8');
  const { rename } = await import('node:fs/promises');
  await rename(temporario, arquivo);
}
async function garantirArquivos() {
  await mkdir(pastaDados, { recursive: true });
  if (!await lerJSON(arquivoDemandas, null)) await salvarJSON(arquivoDemandas, []);
  let usuarios = await lerJSON(arquivoUsuarios, null);
  if (!usuarios) {
    usuarios = [];
    for (const u of [
      { nome: 'Administrador SPACFlow', email: 'admin@spacflow.local', senha: 'Admin@123', perfil: 'administrador' },
      { nome: 'Gestor VISAT', email: 'gestor@spacflow.local', senha: 'Gestor@123', perfil: 'gestor' },
      { nome: 'Técnico VISAT', email: 'tecnico@spacflow.local', senha: 'Tecnico@123', perfil: 'tecnico' },
    ]) {
      const salt = randomBytes(16).toString('hex');
      const hash = (await scrypt(u.senha, salt, 64)).toString('hex');
      usuarios.push({ id: randomBytes(8).toString('hex'), nome: u.nome, email: u.email, perfil: u.perfil, salt, hash, ativo: true });
    }
    await salvarJSON(arquivoUsuarios, usuarios);
  }
}
const responder = (res, status, dados, extra = {}) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra });
  res.end(JSON.stringify(dados));
};
async function corpo(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  if (!raw) return {};
  if (raw.length > 1_000_000) throw new Error('Corpo da requisição muito grande.');
  return JSON.parse(raw);
}
function cookie(req, nome) {
  return (req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith(nome + '='))?.slice(nome.length + 1);
}
async function usuarioAtual(req) {
  const token = cookie(req, 'spacflow_session');
  const id = token && sessoes.get(token);
  if (!id) return null;
  const usuarios = await lerJSON(arquivoUsuarios, []);
  const u = usuarios.find(x => x.id === id && x.ativo);
  return u ? { id: u.id, nome: u.nome, email: u.email, perfil: u.perfil } : null;
}
function exigir(usuario, perfis) {
  if (!usuario) return 'Não autenticado.';
  if (!perfis.includes(usuario.perfil)) return 'Seu perfil não tem permissão para esta operação.';
  return null;
}
const emailValido = s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const semAcento = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

function validarDemanda(d) {
  if (!String(d.titulo ?? '').trim()) throw new Error('O título é obrigatório.');
  if (String(d.titulo).trim().length > 150) throw new Error('O título deve ter até 150 caracteres.');
  if (!String(d.solicitante ?? '').trim()) throw new Error('O solicitante é obrigatório.');
  if (!ORIGENS.includes(d.origem)) throw new Error('Selecione uma origem válida.');
  if (!CATEGORIAS.includes(d.categoria)) throw new Error('Selecione uma categoria válida.');
  if (d.status && !STATUS.includes(d.status)) throw new Error('Status inválido.');
  if (d.prioridade && !PRIORIDADES.includes(d.prioridade)) throw new Error('Prioridade inválida.');
  if (d.prazo) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.prazo)) throw new Error('Prazo inválido.');
    const data = new Date(`${d.prazo}T00:00:00`);
    if (Number.isNaN(data.getTime()) || data.toISOString().slice(0, 10) !== d.prazo) throw new Error('A data informada não existe.');
    if (d.prazo < new Date().toLocaleDateString('en-CA')) throw new Error('O prazo não pode estar no passado.');
  }
}
async function api(req, res, url) {
  const metodo = req.method;
  const rota = url.pathname;
  if (rota === '/api/health') return responder(res, 200, { ok: true, servico: 'SPACFlow API' });

  if (rota === '/api/auth/login' && metodo === 'POST') {
    const { email, senha } = await corpo(req);
    const usuarios = await lerJSON(arquivoUsuarios, []);
    const u = usuarios.find(x => x.email.toLowerCase() === String(email ?? '').trim().toLowerCase() && x.ativo);
    if (!u) return responder(res, 401, { erro: 'E-mail ou senha incorretos.' });
    const tentativa = await scrypt(String(senha ?? ''), u.salt, 64);
    if (!timingSafeEqual(tentativa, Buffer.from(u.hash, 'hex'))) return responder(res, 401, { erro: 'E-mail ou senha incorretos.' });
    const token = randomBytes(32).toString('hex');
    sessoes.set(token, u.id);
    return responder(res, 200, { usuario: { id: u.id, nome: u.nome, email: u.email, perfil: u.perfil } }, {
      'Set-Cookie': `spacflow_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800`
    });
  }
  if (rota === '/api/auth/logout' && metodo === 'POST') {
    const token = cookie(req, 'spacflow_session');
    if (token) sessoes.delete(token);
    return responder(res, 200, { ok: true }, { 'Set-Cookie': 'spacflow_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0' });
  }
  if (rota === '/api/auth/me' && metodo === 'GET') {
    const u = await usuarioAtual(req);
    return u ? responder(res, 200, { usuario: u }) : responder(res, 401, { erro: 'Faça login para continuar.' });
  }

  const usuario = await usuarioAtual(req);
  if (!usuario) return responder(res, 401, { erro: 'Faça login para continuar.' });

  if (rota === '/api/usuarios' && metodo === 'GET') {
    const erro = exigir(usuario, ['administrador', 'gestor']);
    if (erro) return responder(res, 403, { erro });
    const usuarios = await lerJSON(arquivoUsuarios, []);
    return responder(res, 200, usuarios.map(({ id, nome, email, perfil, ativo }) => ({ id, nome, email, perfil, ativo })));
  }
  if (rota === '/api/usuarios' && metodo === 'POST') {
    const erro = exigir(usuario, ['administrador']);
    if (erro) return responder(res, 403, { erro });
    const dados = await corpo(req);
    const nome = String(dados.nome ?? '').trim(), email = String(dados.email ?? '').trim().toLowerCase();
    if (!nome || !emailValido(email) || String(dados.senha ?? '').length < 8) return responder(res, 400, { erro: 'Informe nome, e-mail válido e senha com pelo menos 8 caracteres.' });
    if (!['administrador', 'gestor', 'tecnico'].includes(dados.perfil)) return responder(res, 400, { erro: 'Perfil inválido.' });
    const usuarios = await lerJSON(arquivoUsuarios, []);
    if (usuarios.some(x => x.email === email)) return responder(res, 409, { erro: 'Já existe usuário com esse e-mail.' });
    const salt = randomBytes(16).toString('hex');
    const hash = (await scrypt(dados.senha, salt, 64)).toString('hex');
    const novo = { id: randomBytes(8).toString('hex'), nome, email, perfil: dados.perfil, salt, hash, ativo: true };
    usuarios.push(novo); await salvarJSON(arquivoUsuarios, usuarios);
    return responder(res, 201, { id: novo.id, nome, email, perfil: novo.perfil, ativo: true });
  }

  if (rota === '/api/demandas' && metodo === 'GET') {
    const demandas = await lerJSON(arquivoDemandas, []);
    const termo = semAcento(url.searchParams.get('q') || '');
    const status = url.searchParams.get('status') || '';
    const filtradas = demandas.filter(d => (!status || d.status === status) &&
      (!termo || [d.titulo, d.descricao, d.solicitante, d.responsavel, d.numeroSei, d.origem, d.categoria].some(x => semAcento(x).includes(termo))));
    return responder(res, 200, filtradas);
  }
  if (rota === '/api/demandas' && metodo === 'POST') {
    const erro = exigir(usuario, ['administrador', 'gestor', 'tecnico']);
    if (erro) return responder(res, 403, { erro });
    const dados = await corpo(req);
    try { validarDemanda(dados); } catch (e) { return responder(res, 400, { erro: e.message }); }
    const demandas = await lerJSON(arquivoDemandas, []);
    const agora = new Date().toISOString();
    const nova = {
      id: demandas.reduce((m, d) => Math.max(m, Number(d.id) || 0), 0) + 1,
      titulo: String(dados.titulo).trim(), descricao: String(dados.descricao ?? '').trim(),
      solicitante: String(dados.solicitante).trim(), origem: dados.origem, categoria: dados.categoria,
      status: 'Pendente', prioridade: null, responsavel: null, prazo: dados.prazo || null,
      numeroSei: null, historicoStatus: [], pendencias: [], resultado: null,
      criadaEm: agora, criadaPor: usuario.nome, atualizadaEm: agora
    };
    demandas.unshift(nova); await salvarJSON(arquivoDemandas, demandas);
    return responder(res, 201, nova);
  }
  const match = rota.match(/^\/api\/demandas\/(\d+)$/);
  if (match) {
    const id = Number(match[1]);
    const demandas = await lerJSON(arquivoDemandas, []);
    const indice = demandas.findIndex(d => Number(d.id) === id);
    if (indice < 0) return responder(res, 404, { erro: `Demanda #${id} não encontrada.` });
    if (metodo === 'GET') return responder(res, 200, demandas[indice]);
    if (metodo === 'DELETE') {
      const erro = exigir(usuario, ['administrador']);
      if (erro) return responder(res, 403, { erro });
      demandas.splice(indice, 1); await salvarJSON(arquivoDemandas, demandas);
      return responder(res, 200, { ok: true });
    }
    if (metodo === 'PATCH') {
      const erro = exigir(usuario, ['administrador', 'gestor', 'tecnico']);
      if (erro) return responder(res, 403, { erro });
      const alteracoes = await corpo(req), d = demandas[indice];
      const camposPermitidos = ['status', 'prioridade', 'responsavel', 'prazo', 'numeroSei', 'resultado'];
      if (Object.keys(alteracoes).some(k => !camposPermitidos.includes(k))) return responder(res, 400, { erro: 'Campo não permitido.' });
      if (usuario.perfil === 'tecnico' && semAcento(d.responsavel) !== semAcento(usuario.nome)) {
        return responder(res, 403, { erro: 'Técnicos só podem alterar demandas atribuídas a eles. Solicite ao gestor a atribuição.' });
      }
      if (alteracoes.status && !STATUS.includes(alteracoes.status)) return responder(res, 400, { erro: 'Status inválido.' });
      if (alteracoes.prioridade !== undefined && alteracoes.prioridade !== null && !PRIORIDADES.includes(alteracoes.prioridade)) return responder(res, 400, { erro: 'Prioridade inválida.' });
      if (alteracoes.status && ['Concluída', 'Cancelada'].includes(d.status)) return responder(res, 400, { erro: 'Demanda encerrada não pode mudar de status.' });
      if (alteracoes.prazo) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(alteracoes.prazo)) return responder(res, 400, { erro: 'Prazo inválido.' });
        const dataPrazo = new Date(`${alteracoes.prazo}T00:00:00`);
        if (Number.isNaN(dataPrazo.getTime()) || dataPrazo.toISOString().slice(0, 10) !== alteracoes.prazo) return responder(res, 400, { erro: 'A data informada não existe.' });
        if (alteracoes.prazo < new Date().toLocaleDateString('en-CA')) return responder(res, 400, { erro: 'O prazo não pode estar no passado.' });
      }
      if (alteracoes.numeroSei) {
        const seiRegex = /^\d{4,5}\.\d{3,6}\/(\d{4})-\d{2}$/;
        const m = seiRegex.exec(alteracoes.numeroSei);
        if (!m || Number(m[1]) > new Date().getFullYear()) return responder(res, 400, { erro: 'Número SEI inválido ou com ano futuro. Exemplo: 8918.461/2026-70.' });
        if (demandas.some((x, i) => i !== indice && x.numeroSei === alteracoes.numeroSei)) return responder(res, 409, { erro: 'Este SEI já está vinculado a outra demanda.' });
      }
      if (alteracoes.responsavel !== undefined && usuario.perfil === 'tecnico') return responder(res, 403, { erro: 'Técnicos não podem atribuir responsáveis.' });
      if (alteracoes.prioridade !== undefined && usuario.perfil === 'tecnico') return responder(res, 403, { erro: 'Técnicos não podem alterar prioridades.' });
      if (alteracoes.status && alteracoes.status !== d.status) {
        d.historicoStatus ??= [];
        d.historicoStatus.push({ de: d.status, para: alteracoes.status, por: usuario.nome, em: new Date().toISOString() });
      }
      Object.assign(d, alteracoes, { atualizadaEm: new Date().toISOString() });
      await salvarJSON(arquivoDemandas, demandas);
      return responder(res, 200, d);
    }
  }
  return responder(res, 404, { erro: 'Rota não encontrada.' });
}

const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
await garantirArquivos();
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    if (url.pathname.startsWith('/api/')) return await emSerie(() => api(req, res, url));
    const pedido = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    const arquivo = path.resolve(interfaceDir, `.${pedido}`);
    if (!arquivo.startsWith(interfaceDir + path.sep) && arquivo !== interfaceDir) return responder(res, 403, { erro: 'Acesso negado.' });
    let dados;
    try { dados = await readFile(arquivo); }
    catch (e) {
      if (e.code === 'ENOENT' || e.code === 'EISDIR') return responder(res, 404, { erro: 'Arquivo não encontrado.' });
      throw e;
    }
    res.writeHead(200, { 'Content-Type': tipos[path.extname(arquivo)] || 'application/octet-stream' });
    res.end(dados);
  } catch (e) {
    if (e instanceof SyntaxError) return responder(res, 400, { erro: 'JSON inválido.' });
    console.error(e);
    responder(res, 500, { erro: 'Erro interno do servidor.' });
  }
}).listen(PORTA, () => console.log(`SPACFlow disponível em http://localhost:${PORTA}`));