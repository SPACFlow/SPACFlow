import { iniciarDetalhe, abrirDetalhe } from './componentes/detalhe.js';
import { iniciarNavegacao, mostrarTela } from './componentes/navegacao.js';
import { iniciarCadastro } from './funcionalidades/cadastrarDemanda.js';
import { iniciarConsulta } from './funcionalidades/consultarDemandas.js';
import { iniciarAtualizarStatus } from './funcionalidades/atualizarStatus.js';
import { iniciarDefinirPrioridade } from './funcionalidades/definirPrioridade.js';
import { iniciarAtribuirResponsavel } from './funcionalidades/atribuirResponsavel.js';
import { iniciarDefinirPrazo } from './funcionalidades/definirPrazo.js';
import { iniciarPesquisa } from './funcionalidades/pesquisarDemandas.js';
import { iniciarFiltroStatus } from './funcionalidades/filtrarPorStatus.js';
import { iniciarIndicadores } from './funcionalidades/visualizarIndicadores.js';
import { iniciarRegistrarSei } from './funcionalidades/registrarSei.js';
import { iniciarRegistrarPendencia } from './funcionalidades/registrarPendencia.js';
import { iniciarConcluirDemanda } from './funcionalidades/concluirDemanda.js';
import { iniciarIntegracaoSei } from './funcionalidades/integracaoSei.js';
import { iniciarRelatorios } from './funcionalidades/relatorios.js';
import { iniciarConfiguracoes } from './funcionalidades/configuracoes.js';
import { mostrarLogin, usuarioAtual, desenharUsuarioLogado } from './funcionalidades/login.js';
import { $ } from './utils/dom.js';

iniciarDetalhe();

iniciarAtualizarStatus();
iniciarDefinirPrioridade();
iniciarAtribuirResponsavel();
iniciarDefinirPrazo();
iniciarRegistrarSei();
iniciarRegistrarPendencia();
iniciarConcluirDemanda();

iniciarPesquisa();
iniciarFiltroStatus();

iniciarIndicadores();
iniciarCadastro();
iniciarConsulta(abrirDetalhe);

iniciarIntegracaoSei();
iniciarRelatorios();
iniciarConfiguracoes();
iniciarNavegacao();

function entrarNoSistema(usuario) {
  $('#app').hidden = false;
  desenharUsuarioLogado(usuario, () => mostrarLogin(entrarNoSistema));
  mostrarTela();
}

const usuario = usuarioAtual();
if (usuario) entrarNoSistema(usuario);
else mostrarLogin(entrarNoSistema);
