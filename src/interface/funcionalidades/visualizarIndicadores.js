export function calcularIndicadores(demandas, statuses, prioridades) {
  const encerradas = ['Concluída', 'Cancelada'];
  const hoje = new Date().toLocaleDateString('en-CA');
  return {
    total: demandas.length,
    prazosVencidos: demandas.filter(d => d.prazo && d.prazo < hoje && !encerradas.includes(d.status)).length,
    semResponsavel: demandas.filter(d => !d.responsavel).length,
    comSei: demandas.filter(d => Boolean(d.numeroSei)).length,
    porStatus: Object.fromEntries(statuses.map(s => [s, demandas.filter(d => d.status === s).length])),
    porPrioridade: Object.fromEntries([...prioridades, 'Sem prioridade'].map(p => [p, demandas.filter(d => (d.prioridade || 'Sem prioridade') === p).length])),
  };
}
export function htmlIndicadores(demandas, statuses, prioridades) {
  const i = calcularIndicadores(demandas, statuses, prioridades);
  const cards = [
    ['Demandas cadastradas', i.total, 'Total na base', 'azul'],
    ['Prazos vencidos', i.prazosVencidos, 'Precisam de atenção', 'vermelho'],
    ['Sem responsável', i.semResponsavel, 'Aguardando atribuição', 'laranja'],
    ['Com processo SEI', i.comSei, 'Processos vinculados', 'verde'],
  ];
  return `<section class="metricas">${cards.map(([t,n,s,c]) => `<article class="metrica ${c}"><span>${t}</span><strong>${n}</strong><small>${s}</small></article>`).join('')}</section>
    <section class="resumo"><article class="resumo-card"><h3>Demandas por status</h3>${statuses.map(s => `<div class="barra-linha"><span>${s}</span><b>${i.porStatus[s]}</b></div>`).join('')}</article>
    <article class="resumo-card"><h3>Demandas por prioridade</h3>${[...prioridades,'Sem prioridade'].map(p => `<div class="barra-linha"><span>${p}</span><b>${i.porPrioridade[p]}</b></div>`).join('')}</article></section>`;
}