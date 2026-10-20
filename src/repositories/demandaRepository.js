const demandas = [];
let proximoId = 1;

export const demandaRepository = {
  gerarId: () => proximoId++,
  adicionar: (demanda) => { demandas.push(demanda); return demanda; },
  listar: () => [...demandas],
  buscarPorId: (id) => demandas.find((d) => d.id === Number(id)) ?? null,
};
