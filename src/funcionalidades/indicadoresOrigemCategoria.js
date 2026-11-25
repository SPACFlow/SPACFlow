import { ORIGENS, CATEGORIAS, STATUS_FINAIS } from '../models/demanda.js';
import { demandaRepository } from '../repositories/demandaRepository.js';

export const NAO_INFORMADA = 'Não informada';

function agrupar(demandas, campo, valores) {
  const linhas = valores.map((nome) => ({ nome, abertas: 0, encerradas: 0, total: 0 }));
  const semValor = { nome: NAO_INFORMADA, abertas: 0, encerradas: 0, total: 0 };

  for (const demanda of demandas) {
    const linha = linhas.find(({ nome }) => nome === demanda[campo]) ?? semValor;
    if (STATUS_FINAIS.includes(demanda.status)) linha.encerradas += 1;
    else linha.abertas += 1;
    linha.total += 1;
  }

  return semValor.total > 0 ? [...linhas, semValor] : linhas;
}

export function calcularIndicadoresOrigemCategoria() {
  const demandas = demandaRepository.listar();
  return {
    total: demandas.length,
    porOrigem: agrupar(demandas, 'origem', ORIGENS),
    porCategoria: agrupar(demandas, 'categoria', CATEGORIAS),
  };
}

const plural = (n, singular, varias) => `${n} ${n === 1 ? singular : varias}`;

function imprimirGrupo(titulo, linhas) {
  console.log(`\n${titulo}:`);
  for (const { nome, abertas, encerradas, total } of linhas) {
    const detalhe = total === 0
      ? 'nenhuma demanda'
      : `${plural(total, 'demanda', 'demandas')} (${abertas} em aberto, ${plural(encerradas, 'encerrada', 'encerradas')})`;
    console.log(`  ${nome}: ${detalhe}`);
  }
}

export async function executarIndicadoresOrigemCategoria() {
  const { total, porOrigem, porCategoria } = calcularIndicadoresOrigemCategoria();
  console.log('\n=== Indicadores por origem e categoria ===');
  console.log(total === 0 ? 'Nenhuma demanda cadastrada ainda.' : `Total de demandas: ${total}`);
  imprimirGrupo('Por origem', porOrigem);
  imprimirGrupo('Por categoria', porCategoria);
}
