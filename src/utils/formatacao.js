// BASE (Dupla A): funções de apoio usadas por várias histórias.

export function hojeISO() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

// 'DD/MM/AAAA' -> 'AAAA-MM-DD' (formato guardado na demanda)
export function converterDataBR(texto) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto?.trim() ?? '');
  if (!m) throw new Error('Data inválida. Use o formato DD/MM/AAAA.');
  const [, dia, mes, ano] = m;
  const d = new Date(Number(ano), Number(mes) - 1, Number(dia));
  if (d.getFullYear() !== Number(ano) || d.getMonth() !== Number(mes) - 1 || d.getDate() !== Number(dia)) {
    throw new Error('Essa data não existe no calendário.');
  }
  return `${ano}-${mes}-${dia}`;
}

export const formatarDataBR = (iso) => (iso ? iso.split('-').reverse().join('/') : '-');

export function imprimirDemandas(lista) {
  if (lista.length === 0) return console.log('Nenhuma demanda encontrada.');
  console.table(
    lista.map(({ id, titulo, status, prioridade, responsavel, prazo, numeroSei }) => ({
      id, titulo, status,
      prioridade: prioridade ?? '-',
      responsavel: responsavel ?? '-',
      prazo: formatarDataBR(prazo),
      sei: numeroSei ?? '-',
    }))
  );
}
