import { STATUS_FINAIS } from '../models/demanda.js';
import { demandaRepository } from '../repositories/demandaRepository.js';

export const TAMANHO_MAXIMO_PENDENCIA = 200;

function buscarDemanda(id) {
  if (!String(id ?? '').trim()) throw new Error('Informe o ID da demanda.');
  const demanda = demandaRepository.buscarPorId(id);
  if (!demanda) throw new Error(`Demanda #${id} não encontrada. Confira o ID na lista.`);
  demanda.pendencias ??= [];
  return demanda;
}

export function registrarPendencia({ id, descricao, autor }) {
  const demanda = buscarDemanda(id);
  if (STATUS_FINAIS.includes(demanda.status)) {
    throw new Error(`A demanda #${demanda.id} está ${demanda.status.toLowerCase()} e não recebe pendência nova.`);
  }

  const texto = String(descricao ?? '').trim();
  if (!texto) throw new Error('Descreva a pendência. Exemplo: aguardando documento do órgão.');
  if (texto.length > TAMANHO_MAXIMO_PENDENCIA) {
    throw new Error(`A pendência deve ter no máximo ${TAMANHO_MAXIMO_PENDENCIA} caracteres.`);
  }
  const quem = String(autor ?? '').trim();
  if (!quem) throw new Error('Informe quem está registrando a pendência.');

  const pendencia = {
    numero: demanda.pendencias.length + 1,
    descricao: texto,
    por: quem,
    em: new Date().toISOString(),
    resolvidaEm: null,
  };
  demanda.pendencias.push(pendencia);
  return { demanda, pendencia };
}

export function resolverPendencia({ id, numero }) {
  const demanda = buscarDemanda(id);
  const pendencia = demanda.pendencias.find((p) => p.numero === Number(numero));
  if (!pendencia) throw new Error(`A demanda #${demanda.id} não tem a pendência ${numero}.`);
  if (pendencia.resolvidaEm) throw new Error(`A pendência ${pendencia.numero} já está resolvida.`);
  pendencia.resolvidaEm = new Date().toISOString();
  return { demanda, pendencia };
}

const formatarData = (iso) => new Date(iso).toLocaleDateString('pt-BR');

export function imprimirPendencias(demanda) {
  const pendencias = demanda.pendencias ?? [];
  if (pendencias.length === 0) return console.log(`A demanda #${demanda.id} não tem pendências.`);
  console.log(`Pendências da demanda #${demanda.id}:`);
  for (const p of pendencias) {
    const situacao = p.resolvidaEm ? `resolvida em ${formatarData(p.resolvidaEm)}` : 'aberta';
    console.log(`  ${p.numero}. ${p.descricao} · ${p.por}, ${formatarData(p.em)} · ${situacao}`);
  }
}

export async function executarRegistrarPendencia(rl) {
  const demandas = demandaRepository.listar();
  if (demandas.length === 0) return console.log('Nenhuma demanda cadastrada.');

  console.table(
    demandas.map(({ id, titulo, status, pendencias }) => ({
      id, titulo, status,
      pendencias: (pendencias ?? []).filter((p) => !p.resolvidaEm).length,
    }))
  );

  const demanda = buscarDemanda(await rl.question('ID da demanda: '));
  imprimirPendencias(demanda);

  const acao = (await rl.question('1 = registrar nova pendência, 2 = marcar uma como resolvida: ')).trim();
  if (acao === '1') {
    const descricao = await rl.question(`Pendência (até ${TAMANHO_MAXIMO_PENDENCIA} caracteres): `);
    const autor = await rl.question('Seu nome: ');
    const { pendencia } = registrarPendencia({ id: demanda.id, descricao, autor });
    console.log(`✔ Pendência ${pendencia.numero} registrada na demanda #${demanda.id}.`);
  } else if (acao === '2') {
    const numero = await rl.question('Número da pendência: ');
    const { pendencia } = resolverPendencia({ id: demanda.id, numero });
    console.log(`✔ Pendência ${pendencia.numero} da demanda #${demanda.id} marcada como resolvida.`);
  } else {
    throw new Error('Escolha 1 para registrar ou 2 para resolver.');
  }
  imprimirPendencias(demanda);
}
