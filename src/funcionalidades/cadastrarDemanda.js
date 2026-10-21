
import {
    criarDemanda,
    ORIGENS,
    CATEGORIAS
} from '../models/demanda.js';

import {
    demandaRepository
} from '../repositories/demandaRepository.js';

export function cadastrarDemanda({
    titulo,
    descricao,
    solicitante,
    origem,
    categoria,
    prazo
}) {
    if (!titulo?.trim()) {
        throw new Error('O título é obrigatório.');
    }

    if (!solicitante?.trim()) {
        throw new Error('O solicitante é obrigatório.');
    }

    if (!origem || !ORIGENS.includes(origem)) {
        throw new Error('Selecione uma origem válida.');
    }

    if (!categoria || !CATEGORIAS.includes(categoria)) {
        throw new Error('Selecione uma categoria válida.');
    }

    if (!prazo || !/^\d{4}-\d{2}-\d{2}$/.test(prazo)) {
        throw new Error('Informe um prazo válido no formato AAAA-MM-DD.');
    }

    const [ano, mes, dia] = prazo.split('-').map(Number);
    const dataPrazo = new Date(Date.UTC(ano, mes - 1, dia));

    if (
        dataPrazo.getUTCFullYear() !== ano ||
        dataPrazo.getUTCMonth() !== mes - 1 ||
        dataPrazo.getUTCDate() !== dia
    ) {
        throw new Error('A data do prazo não é válida.');
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (new Date(`${prazo}T00:00:00`) < hoje) {
        throw new Error('O prazo não pode estar no passado.');
    }

    const demanda = criarDemanda({
        id: demandaRepository.gerarId(),
        titulo: titulo.trim(),
        descricao: descricao?.trim() ?? '',
        solicitante: solicitante.trim(),
        origem,
        categoria,
        prazo
    });

    return demandaRepository.adicionar(demanda);
}

export async function executarCadastrar(rl) {
    try {
        console.log('\n=== CADASTRO DE DEMANDA — SPAC FLOW ===\n');

        const titulo = await rl.question('Título da demanda: ');
        const descricao = await rl.question('Descrição: ');
        const solicitante = await rl.question('Solicitante: ');

        console.log('\nOrigens disponíveis:');
        ORIGENS.forEach((origem, indice) => {
            console.log(`${indice + 1}. ${origem}`);
        });

        const opcaoOrigem = await rl.question('Escolha a origem: ');
        const origem = ORIGENS[Number(opcaoOrigem) - 1];

        console.log('\nCategorias disponíveis:');
        CATEGORIAS.forEach((categoria, indice) => {
            console.log(`${indice + 1}. ${categoria}`);
        });

        const opcaoCategoria = await rl.question('Escolha a categoria: ');
        const categoria = CATEGORIAS[Number(opcaoCategoria) - 1];

        const prazo = await rl.question(
            'Prazo para atendimento (AAAA-MM-DD): '
        );

        const demanda = cadastrarDemanda({
            titulo,
            descricao,
            solicitante,
            origem,
            categoria,
            prazo
        });

        console.log(`\nDemanda #${demanda.id} cadastrada com sucesso!`);
        console.log(demanda);

        return demanda;
    } catch (erro) {
        console.error(`\nErro no cadastro: ${erro.message}`);
        return null;
    }
}
