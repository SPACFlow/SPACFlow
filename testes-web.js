import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('.gitignore protege os hashes de senha e os arquivos temporários', async () => {
  const ignorados = await readFile(new URL('./.gitignore', import.meta.url), 'utf8');
  for (const item of ['database/usuarios.json', 'database/*.tmp']) {
    assert.ok(ignorados.includes(item), `falta ${item} no .gitignore`);
  }
});
test('package aponta o servidor web para a API', async () => {
  const pkg = JSON.parse(await readFile(new URL('./package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.scripts.web, 'node src/web.js');
});
