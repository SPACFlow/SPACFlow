
export const STATUS = [
    'Pendente',
    'Em andamento',
    'Concluída',
    'Cancelada'
];

export const PRIORIDADES = [
    'Baixa',
    'Média',
    'Alta',
    'Urgente'
];

export const ORIGENS = [
    'Ministério Público',
    'Prefeitura',
    'Ouvidoria',
    'Secretaria de Saúde',
    'Outro órgão'
];

export const CATEGORIAS = [
    'Alimentos',
    'Medicamentos',
    'Saneamento',
    'Estabelecimentos de saúde',
    'Outros'
];

export function criarDemanda({
    id,
    titulo,
    descricao,
    solicitante,
    origem,
    categoria,
    prazo
}) {
    return {
        id,
        titulo,
        descricao,
        solicitante,
        origem,
        categoria,
        prazo,
        status: 'Pendente',
        prioridade: null,
        responsavel: null,
        criadaEm: new Date().toISOString()
    };
}
