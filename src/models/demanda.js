export const STATUS = ['Pendente', 'Em andamento', 'Concluída', 'Cancelada'];
export const PRIORIDADES = ['Baixa', 'Média', 'Alta', 'Urgente'];
export const STATUS_FINAIS = ['Concluída', 'Cancelada'];

export const ORIGENS = ['Ministério Público', 'Prefeitura', 'Ouvidoria', 'Secretaria de Saúde', 'Outro órgão'];

export const CATEGORIAS = [
  'Acidente de trabalho',
  'Doença relacionada ao trabalho',
  'Inspeção de ambiente de trabalho',
  'Parecer técnico',
  'Outros',
];

export function criarDemanda({ id, titulo, descricao, solicitante, origem = null, categoria = null, prazo = null }) {
  return {
    id,
    titulo,
    descricao,
    solicitante,
    origem,
    categoria,
    status: 'Pendente',
    prioridade: null,
    responsavel: null,
    prazo,
    numeroSei: null,
    historicoStatus: [],
    pendencias: [],
    resultado: null,
    concluidaEm: null,
    criadaEm: new Date().toISOString(),
  };
}
