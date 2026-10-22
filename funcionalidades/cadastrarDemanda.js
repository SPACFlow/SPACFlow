import { criarDemanda } from '../models/demanda.js';
import { demandaRepository } from '../repositories/demandaRepository.js';

export function cadastrarDemanda({ titulo, descricao, solicitante }) {
  if (!titulo?.trim()) throw new Error('O título é obrigatório.');
  if (!solicitante?.trim()) throw new Error('O solicitante é obrigatório.');

  const demanda = criarDemanda({
    id: demandaRepository.gerarId(),
    titulo: titulo.trim(),
    descricao: descricao?.trim() ?? '',
    solicitante: solicitante.trim(),
  });
  return demandaRepository.adicionar(demanda);
}

export async function executarCadastrar(rl) {
  const titulo = await rl.question('Título: ');
  const descricao = await rl.question('Descrição: ');
  const solicitante = await rl.question('Solicitante: ');
  const d = cadastrarDemanda({ titulo, descricao, solicitante });
  console.log(`✔ Demanda #${d.id} cadastrada.`);
}