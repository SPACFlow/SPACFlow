const svg = (corpo) =>
  `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${corpo}</svg>`;

export const icones = {
  olho: svg('<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>'),
  olhoFechado: svg('<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>'),
  sair: svg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>'),
  copiar: svg('<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>'),
  escudo: svg('<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>'),
  entrar: svg('<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/>'),
  email: svg('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'),
  cadeado: svg('<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
  pessoa: svg('<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
  usuarioMais: svg('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>'),
};

export function ligarOlhos(raiz) {
  raiz.querySelectorAll('.campo-senha').forEach((campo) => {
    const entrada = campo.querySelector('input');
    const botao = campo.querySelector('.olho');
    const atualizar = () => {
      const visivel = entrada.type === 'text';
      const rotulo = visivel ? 'Ocultar senha' : 'Mostrar senha';
      botao.innerHTML = visivel ? icones.olhoFechado : icones.olho;
      botao.setAttribute('aria-label', rotulo);
      botao.title = rotulo;
    };
    botao.addEventListener('click', () => {
      entrada.type = entrada.type === 'password' ? 'text' : 'password';
      atualizar();
      entrada.focus();
    });
    atualizar();
  });
}

export const campoSenha = (nome, rotulo, autocomplete, extra = '') => `
  <label><span class="rotulo-linha">${rotulo}${extra}</span>
    <span class="campo-senha campo-icone">
      ${icones.cadeado}
      <input type="password" name="${nome}" autocomplete="${autocomplete}" required minlength="8" placeholder="••••••••">
      <button type="button" class="olho"></button>
    </span>
  </label>`;

export const campoComIcone = (icone, entrada) => `<span class="campo-icone">${icones[icone]}${entrada}</span>`;
