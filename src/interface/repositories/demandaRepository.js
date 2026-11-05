// Armazenamento em memória. Depois será trocado por JSON, mexendo só neste arquivo.
const diasDepois = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

let proximoId = 1;
const demandas = [
  { titulo: 'Notificação de acidente de trabalho — servidor SES', descricao: 'Demanda recebida da Secretaria de Estado da Saúde.', solicitante: 'Secretaria de Estado da Saúde', prazo: diasDepois(-17), status: 'Novo', prioridade: 'Alta', responsavel: null },
  { titulo: 'Solicitação de inspeção sanitária em almoxarifado central', descricao: 'Inspeção das condições de ergonomia e ventilação do local.', solicitante: 'MPT', prazo: diasDepois(-30), status: 'Em análise', prioridade: 'Alta', responsavel: 'Carlos Menezes' },
  { titulo: 'Investigação de acidente de trabalho grave em hospital regional', descricao: 'Processo solicitando investigação do acidente.', solicitante: 'Hospital Regional', prazo: diasDepois(-61), status: 'Em tratamento', prioridade: 'Alta', responsavel: 'Ana Beatriz Rocha' },
  { titulo: 'Análise de ruído ocupacional em setor de manutenção', descricao: 'Medição de níveis de pressão sonora e recomendações de EPI.', solicitante: 'Setor de Manutenção', prazo: diasDepois(-5), status: 'Concluído', prioridade: 'Média', responsavel: 'Carlos Menezes' },
  { titulo: 'Pedido de informação sobre afastamentos por LER/DORT', descricao: 'Levantamento de afastamentos do último semestre.', solicitante: 'Sindicato dos Servidores', prazo: diasDepois(12), status: 'Novo', prioridade: 'Baixa', responsavel: null },
].map((d) => ({ id: proximoId++, criadaEm: new Date().toISOString(), ...d }));

const ouvintes = [];

export const demandaRepository = {
  gerarId: () => proximoId++,
  adicionar: (demanda) => { demandas.unshift(demanda); demandaRepository.notificar(); return demanda; },
  listar: () => [...demandas],
  buscarPorId: (id) => demandas.find((d) => d.id === Number(id)) ?? null,
  // Quem altera uma demanda chama notificar() para a tela se atualizar sozinha.
  inscrever: (fn) => ouvintes.push(fn),
  notificar: () => ouvintes.forEach((fn) => fn()),
};