export function htmlFiltros(statuses) {
  return `<section class="toolbar">
    <label class="busca"><span>⌕</span><input id="busca" type="search" placeholder="Pesquisar título, solicitante, responsável ou SEI..." aria-label="Pesquisar demandas"></label>
    <select id="filtroStatus" aria-label="Filtrar por status"><option value="">Todos os status</option>${statuses.map(s => `<option>${s}</option>`).join('')}</select>
    <select id="filtroPrioridade" aria-label="Filtrar por prioridade"><option value="">Todas as prioridades</option><option>Urgente</option><option>Alta</option><option>Média</option><option>Baixa</option><option value="__sem">Sem prioridade</option></select>
  </section>`;
}
