export const STATUS = ['Pendente', 'Em andamento', 'Concluída', 'Cancelada'];
export const PRIORIDADES = ['Baixa', 'Média', 'Alta', 'Urgente'];

export function criarDemanda({ id, titulo, descricao, solicitante }) {
  return {
    id,
    titulo,
    descricao,
    solicitante,
    status: 'Pendente',
    prioridade: null,
    responsavel: null,
    criadaEm: new Date().toISOString(),
  };
}
