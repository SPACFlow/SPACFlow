// BASE (Dupla A): reúne os filtros do painel. Cada funcionalidade registra o seu filtro aqui.
const filtros = [];

// desenhar(elemento, aoAlterar): monta o controle e chama aoAlterar(valor) quando a pessoa mexe.
// aceita(demanda, valor): diz se a demanda passa pelo filtro.
export function registrarFiltro(desenhar, aceita) {
  filtros.push({ desenhar, aceita, valor: '' });
}

export function montarFiltros(container, aoMudar) {
  container.innerHTML = '';
  filtros.forEach((filtro) => {
    const el = document.createElement('div');
    el.className = 'filtro';
    container.appendChild(el);
    filtro.desenhar(el, (valor) => { filtro.valor = valor; aoMudar(); });
  });
}

export const aplicarFiltros = (lista) =>
  lista.filter((d) => filtros.every((f) => !f.valor || f.aceita(d, f.valor)));