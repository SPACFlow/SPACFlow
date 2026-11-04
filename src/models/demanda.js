export const STATUS = ['Pendente', 'Em andamento', 'Concluída', 'Cancelada'];
export const PRIORIDADES = ['Baixa', 'Média', 'Alta', 'Urgente'];
export const STATUS_FINAIS = ['Concluída', 'Cancelada'];

export function criarDemanda({ id, titulo, descricao, solicitante }) {
  return {
    id,
    titulo,
    descricao,
    solicitante,
    status: 'Pendente',
    prioridade: null,
    responsavel: null,
        prazo: null,
    numeroSei: null,
    historicoStatus: [],
    criadaEm: new Date().toISOString(),
  };
}
