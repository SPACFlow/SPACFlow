async function requisicao(url, opcoes = {}) {
  const resposta = await fetch(url, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...(opcoes.headers || {}) },
    ...opcoes,
  });
  const tipo = resposta.headers.get('content-type') || '';
  const dados = tipo.includes('application/json') ? await resposta.json() : await resposta.text();
  if (!resposta.ok) throw new Error(dados.erro || `Erro ${resposta.status}`);
  return dados;
}
export const api = {
  entrar: (email, senha) => requisicao('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) }),
  sair: () => requisicao('/api/auth/logout', { method: 'POST' }),
  usuario: () => requisicao('/api/auth/me'),
  listar: (filtros = {}) => {
    const q = new URLSearchParams();
    if (filtros.q) q.set('q', filtros.q);
    if (filtros.status) q.set('status', filtros.status);
    return requisicao(`/api/demandas?${q}`);
  },
  criar: dados => requisicao('/api/demandas', { method: 'POST', body: JSON.stringify(dados) }),
  atualizar: (id, dados) => requisicao(`/api/demandas/${id}`, { method: 'PATCH', body: JSON.stringify(dados) }),
  excluir: id => requisicao(`/api/demandas/${id}`, { method: 'DELETE' }),
  usuarios: () => requisicao('/api/usuarios'),
  criarUsuario: dados => requisicao('/api/usuarios', { method: 'POST', body: JSON.stringify(dados) }),
};
