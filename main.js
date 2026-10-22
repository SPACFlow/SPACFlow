import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import { executarCadastrar } from './funcionalidades/cadastrarDemanda.js';
import { executarConsultar } from './funcionalidades/consultarDemandas.js';
import { executarAtualizarStatus } from './funcionalidades/atualizarStatus.js';
import { executarDefinirPrioridade } from './funcionalidades/definirPrioridade.js';
import { executarAtribuirResponsavel } from './funcionalidades/atribuirResponsavel.js';

const rl = readline.createInterface({ input, output });

const opcoes = {
  '1': ['Cadastrar demanda', executarCadastrar],
  '2': ['Consultar demandas', executarConsultar],
  '3': ['Atualizar status', executarAtualizarStatus],
  '4': ['Definir prioridade', executarDefinirPrioridade],
  '5': ['Atribuir responsável', executarAtribuirResponsavel],
};

async function main() {
  while (true) {
    console.log('\n=== SpacFlow ===');
    for (const [n, [nome]] of Object.entries(opcoes)) console.log(`${n}. ${nome}`);
    console.log('0. Sair');

    const escolha = (await rl.question('> ')).trim();
    if (escolha === '0') break;

    const opcao = opcoes[escolha];
    if (!opcao) { 
        console.log(`Opção inválida. Digite um número de 0 a ${Object.keys(opcoes).length}.`); 
        continue; 
    }

    try {
      await opcao[1](rl);
    } catch (erro) {
      console.log(`Erro: ${erro?.message ?? erro}`);
    }
  }
  console.log('Até logo!');
  rl.close();
}

main();