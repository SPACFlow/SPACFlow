export const STATUS_VALIDOS = [
  'Pendente',
  'Em andamento',
  'Concluída',
  'Cancelada'
];

export const CARGOS_VALIDOS = [
  'Gestor'
];

export function atualizarStatus(demanda, novoStatus, cargo) {
  if (!demanda) {
    throw new Error('Demanda não encontrada.');
  }

  if (!CARGOS_VALIDOS.includes(cargo)) {
    throw new Error('Cargo inválido ou sem permissão.');
  }

  if (!STATUS_VALIDOS.includes(novoStatus)) {
    throw new Error('Status inválido.');
  }

return {
        ...demanda,
        status: novoStatus,
        atualizadaEm: new Date().toISOString()
    };
} // Esta chave fecha a função atualizarStatus

export async function executarAtualizarStatus(rl) {
    console.log("Funcionalidade de atualizar status em desenvolvimento pela dupla...");
}