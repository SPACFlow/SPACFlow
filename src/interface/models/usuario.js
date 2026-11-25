export const CARGOS = {
  coordenador: {
    nome: 'Coordenador(a) VISAT',
    resumo: ['Criar e editar demandas', 'Definir prioridades e prazos', 'Gerenciar usuários', 'Relatórios e backup'],
    permissoes: ['criar', 'prioridade', 'prazo', 'responsavel', 'status', 'concluir', 'pendencia', 'sei', 'usuarios', 'relatorios', 'backup'],
  },
  tecnico: {
    nome: 'Técnico(a)',
    resumo: ['Tratar demandas', 'Registrar pendências', 'Concluir com o resultado'],
    permissoes: ['status', 'concluir', 'pendencia', 'relatorios'],
  },
  administrativo: {
    nome: 'Administrativo',
    resumo: ['Vincular processos SEI', 'Cadastrar demandas recebidas', 'Registrar pendências'],
    permissoes: ['criar', 'sei', 'pendencia', 'relatorios'],
  },
  juridico: {
    nome: 'Jurídico',
    resumo: ['Consultar demandas', 'Registrar parecer como pendência'],
    permissoes: ['pendencia', 'relatorios'],
  },
  visualizador: {
    nome: 'Visualizador',
    resumo: ['Apenas consulta e relatórios'],
    permissoes: ['relatorios'],
  },
};

export const nomeDoCargo = (cargo) => CARGOS[cargo]?.nome ?? 'Não definido';

export const pode = (usuario, permissao) => Boolean(usuario && CARGOS[usuario.cargo]?.permissoes.includes(permissao));
