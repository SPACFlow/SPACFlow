// Testa a API de verdade: sobe o servidor numa pasta temporária (não mexe em database/).
// Rodar: npm run test:api
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const PORTA = 3900 + Math.floor(Math.random() * 90);
const BASE = `http://localhost:${PORTA}`;
let processo, pasta;
const sessoes = {};

async function entrar(email, senha) {
  const r = await fetch(`${BASE}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, senha }) });
  return { status: r.status, cookie: (r.headers.get('set-cookie') || '').split(';')[0] };
}
async function chamar(sessao, metodo, url, corpo) {
  const r = await fetch(BASE + url, { method: metodo, headers: { 'Content-Type': 'application/json', cookie: sessao.cookie }, body: corpo ? JSON.stringify(corpo) : undefined });
  return { status: r.status, corpo: await r.json().catch(() => null) };
}
const nova = (titulo) => ({ titulo, solicitante: 'Teste', origem: 'Prefeitura', categoria: 'Outros' });
const amanha = () => new Date(Date.now() + 864e5).toLocaleDateString('en-CA');

before(async () => {
  pasta = await mkdtemp(path.join(tmpdir(), 'spacflow-'));
  processo = spawn(process.execPath, ['src/web.js'], { env: { ...process.env, PORT: String(PORTA), SPACFLOW_DATABASE: pasta }, stdio: ['ignore', 'pipe', 'inherit'] });
  await new Promise((resolve, reject) => {
    processo.stdout.on('data', (d) => { if (String(d).includes('disponível')) resolve(); });
    processo.on('exit', (codigo) => reject(new Error(`Servidor encerrou (${codigo})`)));
    setTimeout(() => reject(new Error('Servidor não iniciou em 8 segundos')), 8000);
  });
});
after(async () => { processo?.kill(); await rm(pasta, { recursive: true, force: true }); });

test('cria os arquivos do banco na primeira execução, com senhas só em hash', async () => {
  const usuarios = await readFile(path.join(pasta, 'usuarios.json'), 'utf8');
  assert.deepEqual(JSON.parse(await readFile(path.join(pasta, 'demandas.json'), 'utf8')), []);
  assert.ok(usuarios.includes('"hash"') && !usuarios.includes('Admin@123'));
});

test('login: senha errada é recusada e os 3 perfis entram', async () => {
  assert.equal((await entrar('admin@spacflow.local', 'errada')).status, 401);
  sessoes.adm = await entrar('admin@spacflow.local', 'Admin@123');
  sessoes.ges = await entrar('gestor@spacflow.local', 'Gestor@123');
  sessoes.tec = await entrar('tecnico@spacflow.local', 'Tecnico@123');
  assert.deepEqual([sessoes.adm.status, sessoes.ges.status, sessoes.tec.status], [200, 200, 200]);
});

test('sem login a API recusa', async () => {
  assert.equal((await fetch(`${BASE}/api/demandas`)).status, 401);
});

test('usuários: só o administrador cria; o técnico nem lista', async () => {
  const novo = { nome: 'Novo', email: 'novo@exemplo.com', senha: '12345678', perfil: 'tecnico' };
  assert.equal((await chamar(sessoes.tec, 'GET', '/api/usuarios')).status, 403);
  assert.equal((await chamar(sessoes.ges, 'GET', '/api/usuarios')).status, 200);
  assert.equal((await chamar(sessoes.ges, 'POST', '/api/usuarios', novo)).status, 403);
  assert.equal((await chamar(sessoes.adm, 'POST', '/api/usuarios', novo)).status, 201);
  assert.equal((await chamar(sessoes.adm, 'POST', '/api/usuarios', novo)).status, 409);
});

test('cadastro valida título e prazo no passado', async () => {
  assert.equal((await chamar(sessoes.tec, 'POST', '/api/demandas', { titulo: '' })).status, 400);
  assert.equal((await chamar(sessoes.tec, 'POST', '/api/demandas', { ...nova('Passado'), prazo: '2020-01-01' })).status, 400);
});

test('permissões de edição e histórico de status', async () => {
  const criada = await chamar(sessoes.tec, 'POST', '/api/demandas', { ...nova('Primeira'), prazo: amanha() });
  assert.equal(criada.status, 201);
  const url = `/api/demandas/${criada.corpo.id}`;
  assert.equal((await chamar(sessoes.tec, 'PATCH', url, { status: 'Em andamento' })).status, 403, 'técnico sem atribuição');
  assert.equal((await chamar(sessoes.ges, 'PATCH', url, { responsavel: 'Técnico VISAT', prioridade: 'Alta' })).status, 200);
  assert.equal((await chamar(sessoes.tec, 'PATCH', url, { prioridade: 'Baixa' })).status, 403, 'técnico não muda prioridade');
  assert.equal((await chamar(sessoes.tec, 'PATCH', url, { status: 'Em andamento' })).status, 200);
  assert.equal((await chamar(sessoes.ges, 'PATCH', url, { numeroSei: '8918.461/2026-70' })).status, 200);
  assert.equal((await chamar(sessoes.ges, 'PATCH', url, { numeroSei: 'abc' })).status, 400);
  assert.equal((await chamar(sessoes.ges, 'PATCH', url, { campoInventado: 1 })).status, 400);
  assert.equal((await chamar(sessoes.ges, 'DELETE', url)).status, 403);
  const lida = (await chamar(sessoes.ges, 'GET', url)).corpo;
  assert.equal(lida.historicoStatus.length, 1);
  assert.equal(lida.historicoStatus[0].por, 'Técnico VISAT');
});

test('15 cadastros ao mesmo tempo: nenhum se perde e os ids não se repetem', async () => {
  await Promise.all(Array.from({ length: 15 }, (_, i) => chamar(sessoes.ges, 'POST', '/api/demandas', nova(`Simultânea ${i}`))));
  const todas = (await chamar(sessoes.ges, 'GET', '/api/demandas')).corpo;
  assert.equal(todas.length, 16); // 1 do teste anterior + 15
  assert.equal(new Set(todas.map((d) => d.id)).size, 16);
  assert.equal(JSON.parse(await readFile(path.join(pasta, 'demandas.json'), 'utf8')).length, 16, 'tudo gravado no arquivo');
});

test('arquivo que não existe devolve 404 (e não 500)', async () => {
  assert.equal((await fetch(`${BASE}/nao-existe.js`)).status, 404);
});

