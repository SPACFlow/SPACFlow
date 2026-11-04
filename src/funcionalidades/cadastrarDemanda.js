import { criarDemanda, ORIGENS, CATEGORIAS } from '../models/demanda.js';
import { demandaRepository } from '../repositories/demandaRepository.js';
import { converterDataBR, formatarDataBR, hojeISO } from '../utils/formatacao.js';

const TAMANHO_MAXIMO_TITULO = 150;

export function cadastrarDemanda({ titulo, descricao, solicitante, origem, categoria, prazo }) {
  if (!titulo?.trim()) throw new Error('O título é obrigatório.');
  if (titulo.trim().length > TAMANHO_MAXIMO_TITULO) {
    throw new Error(`O título deve ter no máximo ${TAMANHO_MAXIMO_TITULO} caracteres.`);
  }
  if (!solicitante?.trim()) throw new Error('O solicitante é obrigatório.');
  if (!ORIGENS.includes(origem)) throw new Error(`Escolha uma origem da lista: ${ORIGENS.join(', ')}.`);
  if (!CATEGORIAS.includes(categoria)) throw new Error(`Escolha uma categoria da lista: ${CATEGORIAS.join(', ')}.`);

  let prazoISO = null;
  if (String(prazo ?? '').trim()) {
    prazoISO = converterDataBR(prazo);
    if (prazoISO < hojeISO()) throw new Error('O prazo não pode ser uma data que já passou.');
  }

  const demanda = criarDemanda({
    id: demandaRepository.gerarId(),
    titulo: titulo.trim(),
    descricao: descricao?.trim() ?? '',
    solicitante: solicitante.trim(),
    origem,
    categoria,
    prazo: prazoISO,
  });
  return demandaRepository.adicionar(demanda);
}

async function escolherDaLista(rl, nome, lista) {
  lista.forEach((item, i) => console.log(`  ${i + 1}. ${item}`));
  const resposta = (await rl.question(`Escolha a ${nome} (1 a ${lista.length}): `)).trim();
  const item = /^\d+$/.test(resposta) ? lista[Number(resposta) - 1] : undefined;
  if (!item) throw new Error(`Escolha a ${nome} pelo número, de 1 a ${lista.length}.`);
  return item;
}

export async function executarCadastrar(rl) {
  const titulo = await rl.question('Título: ');
  const descricao = await rl.question('Descrição: ');
  const solicitante = await rl.question('Solicitante: ');
  const origem = await escolherDaLista(rl, 'origem', ORIGENS);
  const categoria = await escolherDaLista(rl, 'categoria', CATEGORIAS);
  const prazo = await rl.question('Prazo (DD/MM/AAAA, ou Enter para deixar sem): ');

  const d = cadastrarDemanda({ titulo, descricao, solicitante, origem, categoria, prazo });
  const comPrazo = d.prazo ? ` Prazo: ${formatarDataBR(d.prazo)}.` : '';
  console.log(`✔ Demanda #${d.id} cadastrada (${d.origem} · ${d.categoria}).${comPrazo}`);
}
