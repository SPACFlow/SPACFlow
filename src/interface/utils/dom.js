export const $ = (seletor) => document.querySelector(seletor);

export const esc = (t) => String(t ?? '').replace(/[&<>"']/g,
  (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const dataBR = (iso) => (iso ? iso.split('-').reverse().join('/') : 'Sem prazo');

export function diasAtraso(d) {
  if (!d.prazo || d.status === 'Concluído') return 0;
  const hoje = new Date().setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((hoje - new Date(d.prazo + 'T00:00:00')) / 86400000));
}

export function avisar(mensagem) {
  const el = $('#aviso');
  el.textContent = mensagem;
  el.classList.add('mostra');
  setTimeout(() => el.classList.remove('mostra'), 2500);
}

export const opcoes = (lista, vazio) =>
  (vazio ? `<option value="">${vazio}</option>` : '') + lista.map((i) => `<option>${esc(i)}</option>`).join('');