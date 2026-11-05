// Junta todas as funcionalidades da interface. Cada dupla mantém os nomes exportados abaixo.
import { iniciarDetalhe, abrirDetalhe } from './componentes/detalhe.js';
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

iniciarDetalhe();                 // base: janela de detalhe da demanda

// Seções da janela de detalhe (aparecem nesta ordem)
iniciarAtualizarStatus();         // história 3
iniciarDefinirPrioridade();       // história 4
iniciarAtribuirResponsavel();     // história 5
iniciarDefinirPrazo();            // história 6
iniciarRegistrarSei();            // história 10

// Filtros do painel: registrar ANTES de iniciarConsulta, que monta a barra de filtros
iniciarPesquisa();                // história 7
iniciarFiltroStatus();            // história 8

iniciarIndicadores();             // história 9
iniciarCadastro();                // história 1
iniciarConsulta(abrirDetalhe);    // história 2