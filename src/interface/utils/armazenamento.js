const memoria = new Map();

function local(tipo) {
  try {
    const area = globalThis[tipo];
    if (!area) return null;
    const teste = '__spacflow__';
    area.setItem(teste, teste);
    area.removeItem(teste);
    return area;
  } catch {
    return null;
  }
}

function criar(tipo) {
  const area = local(tipo);
  return {
    ler(chave, padrao) {
      try {
        const texto = area ? area.getItem(chave) : memoria.get(`${tipo}:${chave}`);
        return texto ? JSON.parse(texto) : padrao;
      } catch {
        return padrao;
      }
    },
    gravar(chave, valor) {
      const texto = JSON.stringify(valor);
      try {
        if (area) area.setItem(chave, texto);
        else memoria.set(`${tipo}:${chave}`, texto);
      } catch {
        memoria.set(`${tipo}:${chave}`, texto);
      }
    },
    apagar(chave) {
      try {
        if (area) area.removeItem(chave);
      } catch {
        return;
      }
      memoria.delete(`${tipo}:${chave}`);
    },
  };
}

export const armazenamento = criar('localStorage');
export const sessaoAtual = criar('sessionStorage');
