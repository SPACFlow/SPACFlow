import { armazenamento } from '../utils/armazenamento.js';

const CHAVE = 'spacflow:demandas';

const diasDepois = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const exemplo = (dados) => ({
  descricao: '', prioridade: null, responsavel: null, numeroSei: null, historicoStatus: [],
  pendencias: [], resultado: null, concluidaEm: null, criadaEm: new Date().toISOString(), ...dados,
});

const exemplos = () => [
  exemplo({ id: 1, titulo: 'Notificação de acidente de trabalho — servidor SES', descricao: 'Demanda recebida da Secretaria de Estado da Saúde.', solicitante: 'Secretaria de Estado da Saúde', origem: 'Secretaria de Saúde', categoria: 'Acidente de trabalho', prazo: diasDepois(-17), status: 'Pendente', prioridade: 'Alta' }),
  exemplo({ id: 2, titulo: 'Solicitação de inspeção sanitária em almoxarifado central', descricao: 'Inspeção das condições de ergonomia e ventilação do local.', solicitante: 'MPT', origem: 'Ministério Público', categoria: 'Inspeção de ambiente de trabalho', prazo: diasDepois(3), status: 'Em andamento', prioridade: 'Alta', responsavel: 'Carlos Menezes', numeroSei: '8918.461/2026-70' }),
  exemplo({ id: 3, titulo: 'Investigação de acidente de trabalho grave em hospital regional', descricao: 'Processo solicitando investigação do acidente.', solicitante: 'Hospital Regional', origem: 'Prefeitura', categoria: 'Acidente de trabalho', prazo: diasDepois(-6), status: 'Em andamento', prioridade: 'Urgente', responsavel: 'Ana Beatriz Rocha' }),
  exemplo({ id: 4, titulo: 'Análise de ruído ocupacional em setor de manutenção', descricao: 'Medição de níveis de pressão sonora e recomendações de EPI.', solicitante: 'Setor de Manutenção', origem: 'Ouvidoria', categoria: 'Parecer técnico', prazo: diasDepois(-5), status: 'Concluída', prioridade: 'Média', responsavel: 'Carlos Menezes', resultado: 'Laudo de ruído enviado com recomendação de protetor auricular.', concluidaEm: new Date().toISOString() }),
  exemplo({ id: 5, titulo: 'Pedido de informação sobre afastamentos por LER/DORT', descricao: 'Levantamento de afastamentos do último semestre.', solicitante: 'Sindicato dos Servidores', origem: 'Outro órgão', categoria: 'Doença relacionada ao trabalho', prazo: diasDepois(12), status: 'Pendente', prioridade: 'Baixa' }),
];

let demandas = armazenamento.ler(CHAVE, null) ?? exemplos();
const ouvintes = [];

const salvar = () => armazenamento.gravar(CHAVE, demandas);

export const demandaRepository = {
  gerarId: () => demandas.reduce((maior, d) => Math.max(maior, Number(d.id) || 0), 0) + 1,
  adicionar: (demanda) => { demandas.unshift(demanda); demandaRepository.notificar(); return demanda; },
  listar: () => [...demandas],
  buscarPorId: (id) => demandas.find((d) => d.id === Number(id)) ?? null,
  atualizar: (id, alteracoes) => {
    const demanda = demandaRepository.buscarPorId(id);
    if (!demanda) return null;
    Object.assign(demanda, alteracoes);
    demandaRepository.notificar();
    return demanda;
  },
  exportar: () => JSON.parse(JSON.stringify(demandas)),
  restaurar: (lista) => {
    if (!Array.isArray(lista) || lista.some((d) => !d || typeof d !== 'object' || !Number.isInteger(d.id) || !d.titulo)) {
      throw new Error('O arquivo não tem uma lista de demandas válida.');
    }
    demandas = lista;
    demandaRepository.notificar();
  },
  restaurarExemplos: () => { demandas = exemplos(); demandaRepository.notificar(); },
  inscrever: (fn) => ouvintes.push(fn),
  notificar: () => { salvar(); ouvintes.forEach((fn) => fn()); },
};
