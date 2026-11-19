import { registrarSecao, abrirDetalhe } from '../componentes/detalhe.js';
import { demandaRepository } from '../repositories/demandaRepository.js';
import { $, esc, dataBR, avisar } from '../utils/dom.js';

const ENCERRADAS = ['Concluída', 'Cancelada'];
const DIA = 86400000;

export function hojeLocal(agora = new Date()) {
  const doisDigitos = (n) => String(n).padStart(2, '0');
  return `${agora.getFullYear()}-${doisDigitos(agora.getMonth() + 1)}-${doisDigitos(agora.getDate())}`;
}

export function converterPrazo(texto) {
  const valor = String(texto ?? '').trim();
  if (!valor) throw new Error('Informe a data do prazo.');

  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
  const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor);
  if (!iso && !br) throw new Error('Data inválida. Use o formato DD/MM/AAAA.');

  const [ano, mes, dia] = (iso ? [iso[1], iso[2], iso[3]] : [br[3], br[2], br[1]]).map(Number);
  const data = new Date(Date.UTC(ano, mes - 1, dia));
  if (data.getUTCFullYear() !== ano || data.getUTCMonth() !== mes - 1 || data.getUTCDate() !== dia) {
    throw new Error(`A data ${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano} não existe.`);
  }
  return data.toISOString().slice(0, 10);
}

export function situacaoDoPrazo(prazo, hoje = hojeLocal()) {
  if (!prazo) return 'Sem prazo definido';
  const dias = Math.round((Date.parse(prazo) - Date.parse(hoje)) / DIA);
  if (dias < 0) return dias === -1 ? 'Atrasada há 1 dia' : `Atrasada há ${-dias} dias`;
  if (dias === 0) return 'Vence hoje';
  if (dias === 1) return 'Vence amanhã';
  return `Vence em ${dias} dias`;
}

async function salvar(id, alteracoes) {
  if (typeof demandaRepository.atualizar === 'function') {
    const atualizada = await demandaRepository.atualizar(id, alteracoes);
    demandaRepository.notificar?.();
    return atualizada;
  }
  const demanda = await demandaRepository.buscarPorId(id);
  Object.assign(demanda, alteracoes);
  demandaRepository.notificar();
  return demanda;
}

export async function definirPrazo(id, texto, hoje = hojeLocal()) {
  const demanda = await demandaRepository.buscarPorId(id);
  if (!demanda) throw new Error(`Demanda #${id} não encontrada.`);
  if (ENCERRADAS.includes(demanda.status)) {
    throw new Error(`A demanda #${demanda.id} está ${demanda.status.toLowerCase()} e não pode receber prazo.`);
  }

  const prazo = converterPrazo(texto);
  if (prazo < hoje) throw new Error('O prazo não pode ser uma data que já passou.');
  if (prazo === demanda.prazo) throw new Error(`A demanda #${demanda.id} já está com prazo em ${dataBR(prazo)}.`);

  const anterior = demanda.prazo ?? null;
  return { demanda: await salvar(demanda.id, { prazo }), anterior };
}

function desenhar(el, d) {
  const encerrada = ENCERRADAS.includes(d.status);
  const situacao = encerrada ? `Demanda ${d.status.toLowerCase()}` : situacaoDoPrazo(d.prazo);
  const atrasada = !encerrada && d.prazo && d.prazo < hojeLocal();

  el.className = 'secao-detalhe';
  el.innerHTML = `
    <h3>Prazo</h3>
    <p class="secao-situacao${atrasada ? ' alerta' : ''}">${esc(d.prazo ? `${dataBR(d.prazo)} · ${situacao}` : situacao)}</p>
    ${encerrada ? '<p class="secao-dica">Demanda encerrada não recebe prazo novo.</p>' : `
    <form class="secao-form" novalidate>
      <label>${d.prazo ? 'Novo prazo' : 'Definir prazo'}
        <input type="date" name="prazo" min="${hojeLocal()}" value="${esc(d.prazo ?? '')}" required>
      </label>
      <button type="submit" class="btn primario">${d.prazo ? 'Alterar prazo' : 'Salvar prazo'}</button>
    </form>
    <p class="erro" role="alert"></p>`}`;

  const form = el.querySelector('form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const erro = el.querySelector('.erro');
    erro.textContent = '';
    try {
      const { demanda, anterior } = await definirPrazo(d.id, form.prazo.value);
      avisar(anterior
        ? `Prazo da demanda #${demanda.id} alterado de ${dataBR(anterior)} para ${dataBR(demanda.prazo)}.`
        : `Demanda #${demanda.id} com prazo em ${dataBR(demanda.prazo)}.`);
      $('#dlgDetalhe').close();
      abrirDetalhe(demanda.id);
    } catch (falha) {
      erro.textContent = falha.message;
    }
  });
}

export function iniciarDefinirPrazo() {
  registrarSecao(desenhar);
}
