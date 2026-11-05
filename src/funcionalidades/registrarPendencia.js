const EM_CONSTRUCAO = 'A história 13 ainda está em construção.';

export function registrarPendencia() {
  throw new Error(EM_CONSTRUCAO);
}

export function resolverPendencia() {
  throw new Error(EM_CONSTRUCAO);
}

export async function executarRegistrarPendencia() {
  console.log(EM_CONSTRUCAO);
}
