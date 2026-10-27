// Testes automatizados do SpacFlow (Sprint 01).
// Rodar com: npm test
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { demandaRepository } from './src/repositories/demandaRepository.js';
import { cadastrarDemanda, executarCadastrar } from './src/funcionalidades/cadastrarDemanda.js';
import { consultarDemandas, executarConsultar } from './src/funcionalidades/consultarDemandas.js';
import { atualizarStatus, executarAtualizarStatus } from './src/funcionalidades/atualizarStatus.js';
import {
  definirPrioridade, ordenarPorPrioridade, listarPorPrioridade, executarDefinirPrioridade,
} from './src/funcionalidades/definirPrioridade.js';
import { atribuirResponsavel, executarAtribuirResponsavel } from './src/funcionalidades/atribuirResponsavel.js';

// Cria uma demanda nova para cada teste não depender dos outros.
const novaDemanda = (titulo = 'Inspeção em fábrica') =>
  cadastrarDemanda({ titulo, descricao: 'Denúncia de condições de trabalho', solicitante: 'MPT' });

// Simula o terminal: devolve as respostas na ordem em que as perguntas são feitas.
const terminalFalso = (...respostas) => ({ question: async () => respostas.shift() ?? '' });

// Silencia a saída dos menus e guarda as mensagens para conferir.
function capturarSaida(t) {
  const mensagens = [];
  t.mock.method(console, 'log', (...partes) => mensagens.push(partes.join(' ')));
  t.mock.method(console, 'table', () => {});
  return mensagens;
}

const encerrar = (id, status = 'Concluída') => { demandaRepository.buscarPorId(id).status = status; };

describe('História 1 — Cadastrar demanda', () => {
  it('cadastra com status Pendente, sem prioridade e sem responsável', () => {
    const d = novaDemanda();
    assert.equal(typeof d.id, 'number');
    assert.equal(d.status, 'Pendente');
    assert.equal(d.prioridade, null);
    assert.equal(d.responsavel, null);
  });

  it('remove espaços extras do título e do solicitante', () => {
    const d = cadastrarDemanda({ titulo: '  Parecer técnico  ', solicitante: '  TRT ' });
    assert.equal(d.titulo, 'Parecer técnico');
    assert.equal(d.solicitante, 'TRT');
  });

  it('gera IDs diferentes para cada demanda', () => {
    const a = novaDemanda();
    const b = novaDemanda();
    assert.ok(b.id > a.id);
  });

  it('recusa demanda sem título', () => {
    assert.throws(() => cadastrarDemanda({ titulo: '   ', solicitante: 'MPT' }), /título é obrigatório/);
  });

  it('recusa demanda sem solicitante', () => {
    assert.throws(() => cadastrarDemanda({ titulo: 'Inspeção' }), /solicitante é obrigatório/);
  });

  it('menu: cadastra com o que o servidor digita', async (t) => {
    const saida = capturarSaida(t);
    const antes = consultarDemandas().length;
    await executarCadastrar(terminalFalso('Vistoria em obra', 'Sem EPI', 'Sindicato'));
    assert.equal(consultarDemandas().length, antes + 1);
    assert.match(saida.join('\n'), /cadastrada/);
  });
});

describe('História 2 — Consultar demandas', () => {
  it('lista as demandas cadastradas', () => {
    const d = novaDemanda('Demanda para consulta');
    assert.ok(consultarDemandas().some((x) => x.id === d.id));
  });

  it('filtra por status', () => {
    const d = novaDemanda();
    encerrar(d.id, 'Cancelada');
    const canceladas = consultarDemandas({ status: 'Cancelada' });
    assert.ok(canceladas.some((x) => x.id === d.id));
    assert.ok(canceladas.every((x) => x.status === 'Cancelada'));
  });

  it('mexer na lista retornada não altera o cadastro', () => {
    const lista = consultarDemandas();
    const total = lista.length;
    lista.pop();
    assert.equal(consultarDemandas().length, total);
  });

  it('menu: mostra a tabela de demandas sem erro', (t) => {
    capturarSaida(t);
    novaDemanda();
    assert.doesNotThrow(() => executarConsultar());
  });
});

describe('História 3 — Atualizar status', () => {
  const comResponsavel = (nome = 'Ana Beatriz') => {
    const d = novaDemanda();
    atribuirResponsavel({ id: d.id, responsavel: nome });
    return d;
  };

  it('o responsável muda o status e a mudança fica salva', () => {
    const d = comResponsavel();
    const { anterior } = atualizarStatus({ id: d.id, novoStatus: 'Em andamento', responsavel: 'Ana Beatriz' });
    assert.equal(anterior, 'Pendente');
    assert.equal(demandaRepository.buscarPorId(d.id).status, 'Em andamento');
  });

  it('aceita o status sem acento e com outras maiúsculas', () => {
    const d = comResponsavel();
    atualizarStatus({ id: d.id, novoStatus: 'CONCLUIDA', responsavel: 'ana beatriz' });
    assert.equal(demandaRepository.buscarPorId(d.id).status, 'Concluída');
  });

  it('recusa demanda sem responsável', () => {
    const d = novaDemanda();
    assert.throws(() => atualizarStatus({ id: d.id, novoStatus: 'Em andamento', responsavel: 'Ana' }), /ainda não tem responsável/);
  });

  it('recusa quem não é o responsável', () => {
    const d = comResponsavel('Ana Beatriz');
    assert.throws(() => atualizarStatus({ id: d.id, novoStatus: 'Em andamento', responsavel: 'Carlos' }), /Só Ana Beatriz/);
  });

  it('recusa status que não existe', () => {
    const d = comResponsavel();
    assert.throws(() => atualizarStatus({ id: d.id, novoStatus: 'Arquivada', responsavel: 'Ana Beatriz' }), /Status inválido/);
  });

  it('recusa o mesmo status atual', () => {
    const d = comResponsavel();
    assert.throws(() => atualizarStatus({ id: d.id, novoStatus: 'Pendente', responsavel: 'Ana Beatriz' }), /já está com status Pendente/);
  });

  it('recusa demanda concluída ou cancelada', () => {
    const d = comResponsavel();
    encerrar(d.id);
    assert.throws(() => atualizarStatus({ id: d.id, novoStatus: 'Em andamento', responsavel: 'Ana Beatriz' }), /não pode mudar de status/);
  });

  it('recusa ID vazio ou inexistente', () => {
    assert.throws(() => atualizarStatus({ id: '', novoStatus: 'Em andamento', responsavel: 'Ana' }), /Informe o ID/);
    assert.throws(() => atualizarStatus({ id: '9999', novoStatus: 'Em andamento', responsavel: 'Ana' }), /não encontrada/);
  });

  it('pode cancelar uma demanda pendente', () => {
    const d = comResponsavel();
    atualizarStatus({ id: d.id, novoStatus: 'Cancelada', responsavel: 'Ana Beatriz' });
    assert.equal(demandaRepository.buscarPorId(d.id).status, 'Cancelada');
  });

  it('menu: o responsável atualiza pelo terminal', async (t) => {
    const saida = capturarSaida(t);
    const d = comResponsavel('Mariana Santos');
    await executarAtualizarStatus(terminalFalso(String(d.id), 'Mariana Santos', 'Em andamento'));
    assert.equal(demandaRepository.buscarPorId(d.id).status, 'Em andamento');
    assert.match(saida.join('\n'), /alterado de Pendente para Em andamento/);
  });
});

describe('História 4 — Definir prioridade', () => {
  it('o gestor define a prioridade', () => {
    const d = novaDemanda();
    const { anterior } = definirPrioridade({ id: d.id, prioridade: 'Alta' });
    assert.equal(anterior, null);
    assert.equal(demandaRepository.buscarPorId(d.id).prioridade, 'Alta');
  });

  it('aceita a prioridade sem acento e informa a anterior ao trocar', () => {
    const d = novaDemanda();
    definirPrioridade({ id: d.id, prioridade: 'Baixa' });
    const { anterior, demanda } = definirPrioridade({ id: d.id, prioridade: 'media' });
    assert.equal(anterior, 'Baixa');
    assert.equal(demanda.prioridade, 'Média');
  });

  it('recusa prioridade que não existe', () => {
    const d = novaDemanda();
    assert.throws(() => definirPrioridade({ id: d.id, prioridade: 'Altíssima' }), /Prioridade inválida/);
  });

  it('recusa a mesma prioridade atual', () => {
    const d = novaDemanda();
    definirPrioridade({ id: d.id, prioridade: 'Urgente' });
    assert.throws(() => definirPrioridade({ id: d.id, prioridade: 'Urgente' }), /já está com prioridade Urgente/);
  });

  it('recusa demanda encerrada e ID inexistente', () => {
    const d = novaDemanda();
    encerrar(d.id);
    assert.throws(() => definirPrioridade({ id: d.id, prioridade: 'Alta' }), /não pode ter a prioridade alterada/);
    assert.throws(() => definirPrioridade({ id: '9999', prioridade: 'Alta' }), /não encontrada/);
  });

  it('ordena da maior para a menor prioridade, sem prioridade por último', () => {
    const lista = [
      { id: 1, prioridade: 'Baixa' },
      { id: 2, prioridade: null },
      { id: 3, prioridade: 'Urgente' },
      { id: 4, prioridade: 'Média' },
    ];
    assert.deepEqual(ordenarPorPrioridade(lista).map((d) => d.id), [3, 4, 1, 2]);
    assert.deepEqual(lista.map((d) => d.id), [1, 2, 3, 4], 'a lista original não pode mudar');
  });

  it('a fila de prioridade não mostra demandas encerradas', () => {
    const d = novaDemanda();
    encerrar(d.id, 'Cancelada');
    assert.ok(!listarPorPrioridade().some((x) => x.id === d.id));
  });

  it('a fila inclui as encerradas quando pedido', () => {
      const d = novaDemanda();
      encerrar(d.id);
      assert.ok(listarPorPrioridade({ incluirEncerradas: true }).some((x) => x.id === d.id));
    });


  it('menu: o gestor define a prioridade pelo terminal', async (t) => {
    capturarSaida(t);
    const d = novaDemanda();
    await executarDefinirPrioridade(terminalFalso(String(d.id), 'Urgente'));
    assert.equal(demandaRepository.buscarPorId(d.id).prioridade, 'Urgente');
  });
});

describe('História 5 — Atribuir responsável', () => {
  it('o gestor atribui um responsável', () => {
    const d = novaDemanda();
    const { anterior } = atribuirResponsavel({ id: d.id, responsavel: '  Ana Beatriz ' });
    assert.equal(anterior, null);
    assert.equal(demandaRepository.buscarPorId(d.id).responsavel, 'Ana Beatriz');
  });

  it('troca o responsável e informa quem saiu', () => {
    const d = novaDemanda();
    atribuirResponsavel({ id: d.id, responsavel: 'Ana Beatriz' });
    const { anterior, demanda } = atribuirResponsavel({ id: d.id, responsavel: 'Mariana Santos' });
    assert.equal(anterior, 'Ana Beatriz');
    assert.equal(demanda.responsavel, 'Mariana Santos');
  });

  it('recusa nome vazio ou com mais de 100 caracteres', () => {
    const d = novaDemanda();
    assert.throws(() => atribuirResponsavel({ id: d.id, responsavel: '   ' }), /obrigatório/);
    assert.throws(() => atribuirResponsavel({ id: d.id, responsavel: 'a'.repeat(101) }), /no máximo 100/);
  });

  it('recusa o mesmo responsável, mesmo com outras maiúsculas', () => {
    const d = novaDemanda();
    atribuirResponsavel({ id: d.id, responsavel: 'Mariana' });
    assert.throws(() => atribuirResponsavel({ id: d.id, responsavel: 'mariana' }), /já é o responsável/);
  });

  it('recusa demanda encerrada, ID vazio e ID inexistente', () => {
    const d = novaDemanda();
    encerrar(d.id, 'Cancelada');
    assert.throws(() => atribuirResponsavel({ id: d.id, responsavel: 'Ana' }), /não pode receber responsável/);
    assert.throws(() => atribuirResponsavel({ id: '', responsavel: 'Ana' }), /Informe o ID/);
    assert.throws(() => atribuirResponsavel({ id: '9999', responsavel: 'Ana' }), /não encontrada/);
  });

  it('menu: o gestor atribui pelo terminal', async (t) => {
    const saida = capturarSaida(t);
    const d = novaDemanda();
    await executarAtribuirResponsavel(terminalFalso(String(d.id), 'João'));
    assert.equal(demandaRepository.buscarPorId(d.id).responsavel, 'João');
    assert.match(saida.join('\n'), /atribuído\(a\) à demanda/);
  });
});

describe('Integração — main.js', () => {
  it('toda função que o main.js importa existe no arquivo de cada dupla', async () => {
    const urlMain = new URL('./src/main.js', import.meta.url);
    const codigo = await readFile(urlMain, 'utf8');
    const imports = [...codigo.matchAll(/import\s*\{([^}]+)\}\s*from\s*'(\.\/funcionalidades\/[^']+)'/g)];
    assert.equal(imports.length, 5, 'o main.js deve importar as 5 funcionalidades');

    for (const [, nomes, caminho] of imports) {
      const modulo = await import(new URL(caminho, urlMain));
      for (const nome of nomes.split(',').map((n) => n.trim())) {
        assert.equal(typeof modulo[nome], 'function', `${caminho} precisa exportar a função ${nome}`);
      }
    }
  });

  it('fluxo completo: cadastrar, priorizar, atribuir, atualizar e consultar', () => {
    const d = novaDemanda('Fluxo completo VISAT');
    definirPrioridade({ id: d.id, prioridade: 'Alta' });
    atribuirResponsavel({ id: d.id, responsavel: 'Mariana Santos' });
    atualizarStatus({ id: d.id, novoStatus: 'Em andamento', responsavel: 'Mariana Santos' });
    atualizarStatus({ id: d.id, novoStatus: 'Concluída', responsavel: 'Mariana Santos' });

    const final = consultarDemandas({ status: 'Concluída' }).find((x) => x.id === d.id);
    assert.equal(final.prioridade, 'Alta');
    assert.equal(final.responsavel, 'Mariana Santos');
  });
});
