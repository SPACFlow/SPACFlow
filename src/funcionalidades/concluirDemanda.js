const EM_CONSTRUCAO = 'A história 12 ainda está em construção.';

export function concluirDemanda() {
  throw new Error(EM_CONSTRUCAO);
}

export async function executarConcluirDemanda() {
  console.log(EM_CONSTRUCAO);
}
