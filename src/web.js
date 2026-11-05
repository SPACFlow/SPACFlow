// Servidor simples para abrir a interface em http://localhost:3000 (sem dependências).
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), 'interface');
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript' };

http.createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const arquivo = path.join(raiz, url === '/' ? 'index.html' : url);
  if (!arquivo.startsWith(raiz)) { res.writeHead(403); return res.end(); }
  try {
    const dados = await readFile(arquivo);
    res.writeHead(200, { 'Content-Type': tipos[path.extname(arquivo)] ?? 'application/octet-stream' });
    res.end(dados);
  } catch {
    res.writeHead(404); res.end('Não encontrado');
  }
}).listen(3000, () => console.log('SpaceFlow em http://localhost:3000'));