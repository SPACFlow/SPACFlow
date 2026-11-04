import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

import { demandaRepository } from './src/repositories/demandaRepository.js';
import { cadastrarDemanda, executarCadastrar } from './src/funcionalidades/cadastrarDemanda.js';
import { consultarDemandas, executarConsultar } from './src/funcionalidades/consultarDemandas.js';
import { atualizarStatus, executarAtualizarStatus } from './src/funcionalidades/atualizarStatus.js';
import {
  definirPrioridade, ordenarPorPrioridade, listarPorPrioridade, executarDefinirPrioridade,
} from './src/funcionalidades/definirPrioridade.js';
import { atribuirResponsavel, executarAtribuirResponsavel } from './src/funcionalidades/atribuirResponsavel.js';
import { definirPrazo, executarDefinirPrazo } from './src/funcionalidades/definirPrazo.js';
import { pesquisarDemandas, executarPesquisar } from './src/funcionalidades/pesquisarDemandas.js';
import { filtrarPorStatus, executarFiltrarStatus } from './src/funcionalidades/filtrarPorStatus.js';
import { calcularIndicadores, executarIndicadores } from './src/funcionalidades/visualizarIndicadores.js';
import { registrarSei, executarRegistrarSei } from './src/funcionalidades/registrarSei.js';
import { formatarDataBR, hojeISO } from './src/utils/formatacao.js';

const ORIGEM = 'Ministério Público';
const CATEGORIA = 'Inspeção de ambiente de trabalho';

const novaDemanda = (titulo = 'Inspeção em fábrica') =>
  cadastrarDemanda({
    titulo, descricao: 'Denúncia de condições de trabalho', solicitante: 'MPT', origem: ORIGEM, categoria: CATEGORIA,
  });

const daquiAUmAno = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear() + 1}`;
};

const terminalFalso = (...respostas) => ({ question: async () => respostas.shift() ?? '' });

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
    const d = cadastrarDemanda({ titulo: '  Parecer técnico  ', solicitante: '  TRT ', origem: ORIGEM, categoria: CATEGORIA });
    assert.equal(d.titulo, 'Parecer técnico');
    assert.equal(d.solicitante, 'TRT');
  });

  it('guarda a origem, a categoria e o prazo, que é opcional', () => {
    const semPrazo = novaDemanda();
    assert.equal(semPrazo.origem, ORIGEM);
    assert.equal(semPrazo.categoria, CATEGORIA);
    assert.equal(semPrazo.prazo, null);

    const prazo = daquiAUmAno();
    const comPrazo = cadastrarDemanda({ titulo: 'Com prazo', solicitante: 'MPT', origem: 'Ouvidoria', categoria: 'Outros', prazo });
    assert.equal(comPrazo.prazo, prazo.split('/').reverse().join('-'));
  });

  it('recusa título com mais de 150 caracteres', () => {
    const base = { solicitante: 'MPT', origem: ORIGEM, categoria: CATEGORIA };
    assert.doesNotThrow(() => cadastrarDemanda({ ...base, titulo: 'a'.repeat(150) }));
    assert.throws(() => cadastrarDemanda({ ...base, titulo: 'a'.repeat(151) }), /no máximo 150 caracteres/);
  });

  it('recusa origem ou categoria fora da lista', () => {
    const base = { titulo: 'Inspeção', solicitante: 'MPT' };
    assert.throws(() => cadastrarDemanda({ ...base, categoria: CATEGORIA }), /Escolha uma origem da lista/);
    assert.throws(() => cadastrarDemanda({ ...base, origem: 'Jornal', categoria: CATEGORIA }), /Escolha uma origem da lista/);
    assert.throws(() => cadastrarDemanda({ ...base, origem: ORIGEM, categoria: 'Alimentos' }), /Escolha uma categoria da lista/);
  });

  it('recusa prazo em formato errado, data que não existe e prazo no passado', () => {
    const base = { titulo: 'Inspeção', solicitante: 'MPT', origem: ORIGEM, categoria: CATEGORIA };
    assert.throws(() => cadastrarDemanda({ ...base, prazo: '2027-02-10' }), /DD\/MM\/AAAA/);
    assert.throws(() => cadastrarDemanda({ ...base, prazo: '30/02/2027' }), /não existe no calendário/);
    assert.throws(() => cadastrarDemanda({ ...base, prazo: '01/01/2020' }), /já passou/);
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
    await executarCadastrar(terminalFalso('Vistoria em obra', 'Sem EPI', 'Sindicato', '1', '3', ''));
    assert.equal(consultarDemandas().length, antes + 1);
    assert.match(saida.join('\n'), /cadastrada \(Ministério Público · Inspeção de ambiente de trabalho\)\./);
  });

  it('menu: cadastra com prazo e recusa número fora da lista', async (t) => {
    const saida = capturarSaida(t);
    await executarCadastrar(terminalFalso('Vistoria em obra', '', 'Sindicato', '3', '1', daquiAUmAno()));
    assert.match(saida.join('\n'), new RegExp(`Prazo: ${daquiAUmAno()}\\.`));
    await assert.rejects(executarCadastrar(terminalFalso('Vistoria', '', 'Sindicato', '9')), /origem pelo número, de 1 a 5/);
    await assert.rejects(executarCadastrar(terminalFalso('Vistoria', '', 'Sindicato', '1', 'abc')), /categoria pelo número, de 1 a 5/);
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

  it('guarda cada mudança no histórico: de qual status, para qual, quem mudou e quando', () => {
    const d = comResponsavel('Ana Beatriz');
    atualizarStatus({ id: d.id, novoStatus: 'em andamento', responsavel: 'ana beatriz' });
    atualizarStatus({ id: d.id, novoStatus: 'Concluída', responsavel: 'Ana Beatriz' });
    const historico = demandaRepository.buscarPorId(d.id).historicoStatus;
    assert.deepEqual(historico.map(({ de, para, por }) => [de, para, por]), [
      ['Pendente', 'Em andamento', 'Ana Beatriz'],
      ['Em andamento', 'Concluída', 'Ana Beatriz'],
    ]);
    assert.ok(historico.every(({ em }) => !Number.isNaN(Date.parse(em))));
  });

  it('tentativa recusada não entra no histórico', () => {
    const d = comResponsavel('Ana Beatriz');
    assert.throws(() => atualizarStatus({ id: d.id, novoStatus: 'Em andamento', responsavel: 'Carlos' }));
    assert.equal(demandaRepository.buscarPorId(d.id).historicoStatus.length, 0);
  });

  it('menu: mostra o histórico depois de atualizar', async (t) => {
    const saida = capturarSaida(t);
    const d = comResponsavel('Mariana Santos');
    await executarAtualizarStatus(terminalFalso(String(d.id), 'Mariana Santos', 'Em andamento'));
    await executarAtualizarStatus(terminalFalso(String(d.id), 'Mariana Santos', 'Concluída'));
    const texto = saida.join('\n');
    assert.match(texto, new RegExp(`Histórico de status da demanda #${d.id}:`));
    assert.match(texto, /Pendente → Em andamento \(Mariana Santos\)/);
    assert.match(texto, /Em andamento → Concluída \(Mariana Santos\)/);
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

describe('História 6 — Definir prazo', () => {
  const ano = new Date().getFullYear() + 1;

  it('define e troca o prazo, aceitando a data de hoje', () => {
    const d = novaDemanda();
    assert.equal(definirPrazo(d.id, `20/12/${ano}`).prazo, `${ano}-12-20`);
    assert.equal(definirPrazo(String(d.id), formatarDataBR(hojeISO())).prazo, hojeISO());
  });

  it('confere o ID e a demanda antes de olhar a data', () => {
    assert.throws(() => definirPrazo('', 'xx'), /Informe o ID/);
    assert.throws(() => definirPrazo(9999, 'xx'), /#9999 não encontrada/);
    const d = novaDemanda();
    encerrar(d.id);
    assert.throws(() => definirPrazo(d.id, 'xx'), /concluída e não pode receber prazo/);
  });

  it('recusa data em formato errado, que não existe, que já passou ou igual à atual', () => {
    const d = novaDemanda();
    assert.throws(() => definirPrazo(d.id, `${ano}-12-20`), /DD\/MM\/AAAA/);
    assert.throws(() => definirPrazo(d.id, `31/02/${ano}`), /não existe no calendário/);
    assert.throws(() => definirPrazo(d.id, '01/01/2020'), /já passou/);
    definirPrazo(d.id, `10/01/${ano}`);
    assert.throws(() => definirPrazo(d.id, `10/01/${ano}`), /já está com prazo em 10\/01/);
  });

  it('menu: define o prazo e depois mostra a troca', async (t) => {
    const saida = capturarSaida(t);
    const d = novaDemanda();
    await executarDefinirPrazo(terminalFalso(String(d.id), `05/03/${ano}`));
    await executarDefinirPrazo(terminalFalso(String(d.id), `06/03/${ano}`));
    assert.ok(saida.includes(`✔ Demanda #${d.id} com prazo em 05/03/${ano}.`));
    assert.ok(saida.includes(`✔ Prazo da demanda #${d.id} alterado de 05/03/${ano} para 06/03/${ano}.`));
  });

  it('menu: ID errado dá erro sem pedir a data', async (t) => {
    capturarSaida(t);
    novaDemanda();
    const perguntas = [];
    const terminal = { question: async (pergunta) => { perguntas.push(pergunta); return '9999'; } };
    await assert.rejects(executarDefinirPrazo(terminal), /não encontrada/);
    assert.equal(perguntas.length, 1);
  });
});

describe('História 7 — Pesquisar demandas', () => {
  const lista = [
    { id: 1, titulo: 'Análise de ruído', descricao: 'Fábrica no Recife', solicitante: 'MPT', responsavel: 'Mariana Lúcia', numeroSei: '8918.461/2026-70' },
    { id: 2, titulo: 'Vistoria', descricao: 'Galpão', solicitante: 'TRT', responsavel: null, numeroSei: null },
  ];
  const comLista = (t) => t.mock.method(demandaRepository, 'listar', () => lista);
  const ids = (demandas) => demandas.map((d) => d.id);

  it('acha pelo título sem diferenciar acento e maiúscula', (t) => {
    comLista(t);
    assert.deepEqual(ids(pesquisarDemandas('ANALISE')), [1]);
  });

  it('acha pela descrição, pelo solicitante, pelo responsável e pelo SEI', (t) => {
    comLista(t);
    assert.deepEqual(ids(pesquisarDemandas('recife')), [1]);
    assert.deepEqual(ids(pesquisarDemandas('trt')), [2]);
    assert.deepEqual(ids(pesquisarDemandas('lucia')), [1]);
    assert.deepEqual(ids(pesquisarDemandas('8918.461')), [1]);
  });

  it('ignora espaços em volta e recusa pesquisa vazia', (t) => {
    comLista(t);
    assert.deepEqual(ids(pesquisarDemandas('  vistoria  ')), [2]);
    assert.throws(() => pesquisarDemandas('   '), /Digite um termo para pesquisar/);
    assert.throws(() => pesquisarDemandas(undefined), /Digite um termo para pesquisar/);
  });

  it('menu: mostra o resultado e avisa quando não acha nada', async (t) => {
    const saida = capturarSaida(t);
    comLista(t);
    await executarPesquisar(terminalFalso('galpão'));
    assert.deepEqual(saida, []);
    await executarPesquisar(terminalFalso('xyz'));
    assert.deepEqual(saida, ['Nenhuma demanda encontrada.']);
  });
});

describe('História 8 — Filtrar por status', () => {
  it('mostra só as demandas do status escolhido', () => {
    const d = novaDemanda('Demanda para filtrar');
    encerrar(d.id, 'Cancelada');
    const { status, demandas } = filtrarPorStatus('Cancelada');
    assert.equal(status, 'Cancelada');
    assert.ok(demandas.some((x) => x.id === d.id));
    assert.ok(demandas.every((x) => x.status === 'Cancelada'));
  });

  it('aceita o status sem acento, com espaços e com qualquer maiúscula', () => {
    assert.equal(filtrarPorStatus('  concluida ').status, 'Concluída');
    assert.equal(filtrarPorStatus('EM ANDAMENTO').status, 'Em andamento');
  });

  it('recusa status vazio ou que não existe, mostrando os status válidos', () => {
    assert.throws(() => filtrarPorStatus('   '), /Informe um status: Pendente, Em andamento, Concluída, Cancelada/);
    assert.throws(() => filtrarPorStatus('Arquivada'), /"Arquivada" não existe\. Use um destes: Pendente, Em andamento/);
  });

  it('menu: mostra quantas demandas achou', async (t) => {
    const saida = capturarSaida(t);
    novaDemanda('Demanda pendente para o menu');
    await executarFiltrarStatus(terminalFalso('pendente'));
    assert.match(saida.join('\n'), /\d+ demanda\(s\) com o status Pendente:/);
  });

  it('menu: avisa quando nenhuma demanda tem o status', async (t) => {
    const saida = capturarSaida(t);
    t.mock.method(demandaRepository, 'listar', () => []);
    await executarFiltrarStatus(terminalFalso('Cancelada'));
    assert.deepEqual(saida, ['Nenhuma demanda com o status Cancelada.']);
  });
});

describe('História 9 — Visualizar indicadores', () => {
  const lista = [
    { id: 1, status: 'Pendente', prioridade: 'Alta', responsavel: 'Ana', numeroSei: '1111.222/2024-33', prazo: '2020-01-01' },
    { id: 2, status: 'Em andamento', prioridade: null, responsavel: null, numeroSei: null, prazo: '2999-12-31' },
    { id: 3, status: 'Concluída', prioridade: 'Alta', responsavel: 'Carlos', numeroSei: null, prazo: '2020-01-01' },
    { id: 4, status: 'Cancelada', prioridade: 'Urgente', responsavel: null, numeroSei: '1111.223/2024-33', prazo: null },
  ];
  const comLista = (t, demandas = lista) => t.mock.method(demandaRepository, 'listar', () => demandas);

  it('conta o total, as demandas sem responsável e as com processo SEI', (t) => {
    comLista(t);
    const i = calcularIndicadores();
    assert.equal(i.total, 4);
    assert.equal(i.semResponsavel, 2);
    assert.equal(i.comSei, 2);
  });

  it('conta por status e por prioridade, incluindo as sem prioridade', (t) => {
    comLista(t);
    const i = calcularIndicadores();
    assert.deepEqual(i.porStatus, { Pendente: 1, 'Em andamento': 1, 'Concluída': 1, Cancelada: 1 });
    assert.deepEqual(i.porPrioridade, { Baixa: 0, 'Média': 0, Alta: 2, Urgente: 1, 'Sem prioridade': 1 });
  });

  it('prazo vencido não conta prazo futuro nem demanda concluída ou cancelada', (t) => {
    comLista(t);
    assert.equal(calcularIndicadores().prazosVencidos, 1);
  });

  it('mostra zero em tudo quando não há demandas', (t) => {
    comLista(t, []);
    const i = calcularIndicadores();
    assert.equal(i.total, 0);
    assert.equal(i.prazosVencidos, 0);
    assert.ok(Object.values(i.porStatus).every((n) => n === 0));
  });

  it('menu: mostra os indicadores', (t) => {
    const saida = capturarSaida(t);
    comLista(t);
    executarIndicadores();
    const texto = saida.join('\n');
    assert.match(texto, /Total de demandas: 4/);
    assert.match(texto, /Prazos vencidos: 1/);
    assert.match(texto, /Sem responsável: 2/);
    assert.match(texto, /Com processo SEI: 2/);
  });
});

describe('História 10 — Registrar processo SEI', () => {
  const anoQueVem = new Date().getFullYear() + 1;

  it('registra o SEI, aceita "SEI" e "SEI nº" na frente e vale para demanda concluída', () => {
    assert.equal(registrarSei(novaDemanda().id, '8918.461/2026-70').numeroSei, '8918.461/2026-70');
    assert.equal(registrarSei(novaDemanda().id, ' SEI 12345.123456/2025-01 ').numeroSei, '12345.123456/2025-01');
    assert.equal(registrarSei(novaDemanda().id, 'sei nº 1111.222/2024-33').numeroSei, '1111.222/2024-33');
    const concluida = novaDemanda();
    encerrar(concluida.id);
    assert.equal(registrarSei(concluida.id, '1111.223/2024-33').numeroSei, '1111.223/2024-33');
  });

  it('confere o ID antes de olhar o número', () => {
    assert.throws(() => registrarSei('', 'abc'), /Informe o ID/);
    assert.throws(() => registrarSei(9999, 'abc'), /#9999 não encontrada/);
  });

  it('recusa número vazio, fora do formato e com ano futuro', () => {
    const d = novaDemanda();
    assert.throws(() => registrarSei(d.id, '   '), /Informe o número/);
    assert.throws(() => registrarSei(d.id, null), /Informe o número/);
    assert.throws(() => registrarSei(d.id, '123.45/2026-7'), /Número do SEI inválido/);
    assert.throws(() => registrarSei(d.id, `8918.461/${anoQueVem}-70`), /ano do processo SEI/);
  });

  it('recusa o mesmo SEI na mesma demanda e em outra demanda', () => {
    const a = novaDemanda();
    const b = novaDemanda();
    registrarSei(a.id, '2222.333/2026-44');
    assert.throws(() => registrarSei(a.id, '2222.333/2026-44'), new RegExp(`#${a.id} já está vinculada`));
    assert.throws(() => registrarSei(b.id, 'SEI 2222.333/2026-44'), new RegExp(`registrado na demanda #${a.id}`));
  });

  it('menu: registra o SEI e depois mostra a troca', async (t) => {
    const saida = capturarSaida(t);
    const d = novaDemanda();
    await executarRegistrarSei(terminalFalso(String(d.id), '3333.444/2026-55'));
    await executarRegistrarSei(terminalFalso(String(d.id), '3333.445/2026-55'));
    assert.ok(saida.includes(`✔ Demanda #${d.id} vinculada ao SEI 3333.444/2026-55.`));
    assert.ok(saida.includes(`✔ SEI da demanda #${d.id} alterado de 3333.444/2026-55 para 3333.445/2026-55.`));
  });
});

describe('Integração — main.js', () => {
  it('toda função que o main.js importa existe no arquivo de cada dupla', async () => {
    const urlMain = new URL('./src/main.js', import.meta.url);
    const codigo = await readFile(urlMain, 'utf8');
    const imports = [...codigo.matchAll(/import\s*\{([^}]+)\}\s*from\s*'(\.\/funcionalidades\/[^']+)'/g)];
    assert.equal(imports.length, 10, 'o main.js deve importar as 10 funcionalidades');

    const arquivos = await readdir(new URL('./src/funcionalidades/', import.meta.url));
    for (const [, nomes, caminho] of imports) {
      const arquivo = caminho.split('/').pop();
      assert.ok(arquivos.includes(arquivo), `${arquivo} não existe em src/funcionalidades (confira maiúsculas e minúsculas)`);

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
