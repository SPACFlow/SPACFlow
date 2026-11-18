import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const diretorioAtual = path.dirname(fileURLToPath(import.meta.url));

const caminhoBanco = path.resolve(
  diretorioAtual,
  '../../database/demandas.json'
);

let filaEscrita = Promise.resolve();

// Garante que a pasta e o arquivo do banco existam.
async function inicializarBanco() {
  await mkdir(path.dirname(caminhoBanco), { recursive: true });

  try {
    await readFile(caminhoBanco, 'utf-8');
  } catch (erro) {
    if (erro.code !== 'ENOENT') throw erro;
    await writeFile(caminhoBanco, '[]', 'utf-8');
  }
}

// Lê as demandas armazenadas no JSON.
async function lerDemandas() {
  await inicializarBanco();

  const conteudo = await readFile(caminhoBanco, 'utf-8');

  let demandas;

  try {
    demandas = JSON.parse(conteudo);
  } catch {
    throw new Error('O arquivo de demandas.json contém JSON inválido.');
  }

  if (!Array.isArray(demandas)) {
    throw new Error('O banco de demandas precisa ser uma lista.');
  }

  return demandas;
}

// Salva os dados no arquivo JSON.
async function salvarDemandas(demandas) {
  await inicializarBanco();

  const temporario = `${caminhoBanco}.${process.pid}.tmp`;

  await writeFile(
    temporario,
    JSON.stringify(demandas, null, 2),
    'utf-8'
  );

  await rename(temporario, caminhoBanco);
}

// Organiza as operações de escrita para evitar conflitos.
function executarEmFila(operacao) {
  const tarefa = filaEscrita.then(operacao);

  filaEscrita = tarefa.catch(() => {});

  return tarefa;
}

export const demandaRepository = {

  // Lista todas as demandas.
  async listar() {
    await filaEscrita;
    return lerDemandas();
  },

  // Busca uma demanda pelo ID.
  async buscarPorId(id) {
    await filaEscrita;

    const demandas = await lerDemandas();

    return demandas.find(
      (demanda) => demanda.id === Number(id)
    ) ?? null;
  },

  // Adiciona uma nova demanda.
  async adicionar(demanda) {
    if (!demanda || typeof demanda !== 'object' || Array.isArray(demanda)) {
      throw new Error('Dados da demanda inválidos.');
    }

    return executarEmFila(async () => {
      const demandas = await lerDemandas();

      const proximoId = demandas.reduce(
        (maior, atual) => Math.max(maior, Number(atual.id) || 0),
        0
      ) + 1;

      const novaDemanda = {
        ...demanda,
        id: proximoId,
        criadaEm: demanda.criadaEm ?? new Date().toISOString()
      };

      demandas.push(novaDemanda);

      await salvarDemandas(demandas);

      return novaDemanda;
    });
  },

  // Atualiza uma demanda existente.
  async atualizar(id, alteracoes) {
    return executarEmFila(async () => {
      const demandas = await lerDemandas();

      const indice = demandas.findIndex(
        (demanda) => demanda.id === Number(id)
      );

      if (indice === -1) return null;

      demandas[indice] = {
        ...demandas[indice],
        ...alteracoes,
        id: Number(id)
      };

      await salvarDemandas(demandas);

      return demandas[indice];
    });
  },

  // Exclui uma demanda pelo ID.
  async excluir(id) {
    return executarEmFila(async () => {
      const demandas = await lerDemandas();

      const filtradas = demandas.filter(
        (demanda) => demanda.id !== Number(id)
      );

      if (filtradas.length === demandas.length) {
        return false;
      }

      await salvarDemandas(filtradas);

      return true;
    });
  }

};
