const EM_CONSTRUCAO = 'A história 11 ainda está em construção.';

export function alertasDePrazo() {
  throw new Error(EM_CONSTRUCAO);
}

export async function executarAlertasDePrazo() {
  console.log(EM_CONSTRUCAO);
}
