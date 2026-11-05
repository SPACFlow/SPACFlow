# 🛡️ SpacFlow — VISAT Recife

<div align="center">
  <img src="./assets/logo.png" alt="SpacFlow Header Banner" width="100%" />
</div>

<br />

> **Plataforma de Governança, Rastreabilidade e Controle SLA de Fiscalizações em Saúde do Trabalhador**

| **Parâmetro** | **Detalhe do Projeto** |
| :--- | :--- |
| **Instituição Parceira** | Vigilância em Saúde do Trabalhador (VISAT) — Sec. de Saúde do Recife |
| **Demandantes Externos** | MPT (Ministério Público do Trabalho), TRT, Sindicatos e Conselhos |
| **Abordagem** | Design Thinking Coletivo + Framework Scrum |

> 🚀 **Central de Documentação do Projeto:**  
> [![Google Sites](https://img.shields.io/badge/Documentação_Oficial-Google_Sites-4285F4?style=for-the-badge&logo=google)](https://sites.google.com/cesar.school/spacflow?usp=sharing)

---

## 🔎 Rastreabilidade

| Artefato | Onde acompanhar |
| :--- | :--- |
| **Board da Sprint (Kanban)** | [Abrir o Board](https://immense-session-fee.notion.site/SpacFlow-Gest-o-do-Projeto-Acad-mico-064d783fc7fc457a9169604b16bad351) |
| **Issues (tarefas e bugs)** | [github.com/SPACFlow/SPACFlow/issues](https://github.com/SPACFlow/SPACFlow/issues) |
| **Pull Requests** | [github.com/SPACFlow/SPACFlow/pulls](https://github.com/SPACFlow/SPACFlow/pulls?q=is%3Apr) |
| **Histórico de commits** | [github.com/SPACFlow/SPACFlow/commits](https://github.com/SPACFlow/SPACFlow/commits/main) |
| **Histórias das Sprints 01 e 02** | [Seção 9](#9-histórias-de-usuário) |
| **Vídeos e testes** | [Seção 13](#13-evidências-e-screencasts) |

---

## 📌 Sumário Navegável
* [1. Visão Geral & Impacto Institucional](#1-visão-geral--impacto-institucional)
* [2. Diagnóstico Operacional: Antes vs. SpacFlow](#2-diagnóstico-operacional-antes-vs-spacflow)
* [3. Prototipação do produto](#3-prototipação-do-produto)
* [4. Mapeamento de Usuário (Persona & Jornada)](#4-mapeamento-de-usuário-persona--jornada)
* [5. Priorização do Escopo (Matriz MoSCoW)](#5-priorização-do-escopo-matriz-moscow)
* [6. Cronograma & Roadmap por Semanas](#6-cronograma--roadmap-por-semanas)
* [7. Gestão Ágil & Governança Operacional](#7-gestão-ágil--governança-operacional)
* [8. Corpo Técnico & Equipe do Projeto](#8-corpo-técnico--equipe-do-projeto)
* [9. Histórias de Usuário](#9-histórias-de-usuário)
* [10. Como Executar e Testar](#10-como-executar-e-testar)
* [11. Relato de Pares (Pair Programming)](#11-relato-de-pares-pair-programming)
* [12. Quadro Kanban de Execução (Board)](#12-quadro-kanban-de-execução-board)
* [13. Evidências e Screencasts](#13-evidências-e-screencasts)

---

## 1. Visão Geral & Impacto Institucional

O **SpacFlow** é uma solução de engenharia de software desenvolvida para sanar a opacidade e a fragmentação no acompanhamento de requisições oficiais na **VISAT Recife**.

A unidade opera sob constante demanda por pareceres técnicos e inspeções de campo. Sem um sistema centralizado, os processos tramitam via planilhas e e-mails isolados, gerando riscos de descumprimento de prazos judiciais e falta de visibilidade sobre a sobrecarga das equipes técnicas. O SpacFlow fornece trilha de auditoria e controle em tempo real do ciclo de vida das requisições.

---

## 2. Diagnóstico Operacional: Antes vs. SpacFlow

| Indicador / Processo | Gestão Tradicional (Planilhas / E-mails) | Solução SpacFlow |
| :--- | :--- | :--- |
| **Gestão de SLA Legal** | Controle manual de datas em células com alto risco de atraso em respostas ao MPT/TRT | Painel com contagem regressiva e alertas visuais automáticos de vencimento |
| **Rastreabilidade** | Histórico disperso entre caixas de entrada e pastas de arquivos locais | Linha do tempo imutável com registro de todas as ações por fiscal |
| **Carga de Trabalho** | Ausência de indicadores sobre a distribuição de solicitações na equipe | Visualização Kanban por inspetor e relatórios gerenciais de capacidade |
| **Documentação** | Risco de perda de laudos, anexos e fotos colhidas em vistorias de campo | Repositório centralizado anexado à requisição (PDF, CSV, DOCX) |

---

## 3. Prototipação do produto

Para manter a transparência do processo de design e evitar a poluição visual na rolagem da página, as evidências de prototipação estão disponíveis nos painéis expansíveis abaixo:

<details>
  <summary><b>🎥 Clique para expandir o Screencast</b></summary>
  <br />
  <p><b>🎬 Screencast — Demonstração do Protótipo</b><br/>
  Assista à gravação demonstrando o fluxo de uso do sistema, dividida pelos épicos mapeados.</p>
  <div align="center">

  **1º Épico** — `0:00 – 2:03`
  <br />
  [![Assistir o 1º Épico no YouTube](https://img.shields.io/badge/Assistir_1º_Épico-YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/s-iLAhLnd8c)

  <br /><br />

  **2º Épico** — `2:04 – 2:51`
  <br />
  [![Assistir o 2º Épico no YouTube](https://img.shields.io/badge/Assistir_2º_Épico-YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/s-iLAhLnd8c?t=124)

  <br /><br />

  **3º Épico** — `2:52 – 4:42`
  <br />
  [![Assistir o 3º Épico no YouTube](https://img.shields.io/badge/Assistir_3º_Épico-YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/s-iLAhLnd8c?t=172)

  <br /><br />

  **4º Épico** — `4:43 – 6:16`
  <br />
  [![Assistir o 4º Épico no YouTube](https://img.shields.io/badge/Assistir_4º_Épico-YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/s-iLAhLnd8c?t=283)

  </div>
</details>

<br />

<details>
  <summary><b>🎨 Clique para expandir o Storyboard e os Wireframes</b></summary>
  <br />
  <p><i>Da jornada desenhada a mão às telas finais do sistema, com cada artefato rastreado até as histórias de usuário que atende.</i></p>

  <p><b>📌 Storyboard — Jornada Visual dos Épicos</b><br/>
  Representa, em quadros ilustrados, a jornada completa do usuário em cada um dos 4 épicos do SpacFlow: cadastro e registro da demanda, acompanhamento e fluxo da demanda, monitoramento e alertas, e dashboards/administração — mostrando passo a passo as ações do agente, do fiscal e do gestor dentro do sistema.</p>
  <div align="center">
    <img src="./assets/storyboard_epicos.png" alt="Storyboard dos Épicos — SpacFlow" width="95%" />
  </div>

  <br />

  <p><b>🖥️ Wireframes — Telas de Alta Fidelidade</b><br/>
  Telas principais do sistema, organizadas pelos mesmos 4 épicos do storyboard. As setas indicam qual história de usuário cada elemento atende: registro de demanda e anexos (US01, US07); execução e monitoramento, com atribuição, status, histórico, alerta de atraso e conclusão (US05, US06, US11, US20); dashboards gerenciais por status, origem e responsável (US14, US15, US16); e gestão administrativa de perfis e usuários (US19).</p>
  <div align="center">
    <img src="./assets/wireframes_epicos.png" alt="Wireframes de Alta Fidelidade por Épico com mapeamento das Histórias de Usuário — SpacFlow" width="95%" />
  </div>
</details>

<br />

<details>
  <summary><b>🔗 Clique para expandir os Diagramas de Atividade</b></summary>
  <br />
  <p><i>Diagramas de atividade modelando o comportamento operacional e as decisões dos fluxos mapeados.</i></p>

  <p><b>1. Cadastrar Demanda</b><br/>
  Fluxo de entrada da solicitação, ramificando em paralelo a classificação da demanda, definição de prioridade e anexação de documentos e evidências.</p>
  <div align="center">
    <img src="./assets/diagrama.jpeg" alt="Diagrama de Atividade — Cadastrar Demanda" width="90%" />
  </div>

  <br />

  <p><b>2. Acompanhamento e Fluxo de Demanda</b><br/>
  Sequência do ciclo de vida da solicitação: início do acompanhamento, atribuição de responsáveis, registro de impedimentos ou pendências e conclusão da demanda.</p>
  <div align="center">
    <img src="./assets/diagrama2.jpeg" alt="Diagrama de Atividade — Acompanhamento e Fluxo de Demanda" width="90%" />
  </div>

  <br />

  <p><b>3. Monitoramento e Alertas</b><br/>
  Processo de controle e rastreabilidade: filtragem de demandas, consulta ao processo SEI, notificação de nova atribuição e emissão de alertas para demandas atrasadas.</p>
  <div align="center">
    <img src="./assets/diagrama3.jpeg" alt="Diagrama de Atividade — Monitoramento e Alertas" width="90%" />
  </div>

  <br />

  <p><b>4. Dashboards e Administração</b><br/>
  Fluxo de gestão operacional dividido entre a visualização de métricas (gerenciamento por status, origem/categoria ou responsável técnico) e a governança de acessos através do cadastro de perfis (função, identificação e credenciais).</p>
  <div align="center">
    <img src="./assets/diagrama4.jpeg" alt="Diagrama de Atividade — Dashboards e Administração" width="90%" />
  </div>
</details>

---

## 4. Mapeamento de Usuário (Persona & Jornada)

### 👤 Persona Representativa
* **Ana Beatriz Souza (34 anos)** — *Técnica de Vigilância Sanitária*.
* **Contexto:** Necessita responder a órgãos externos dentro do prazo legal enquanto realiza fiscalizações externas.
* **Principal Dor:** Desperdiçar tempo reorganizando prioridades em planilhas informais e cobrando retornos por telefone.

### 🛣️ Jornada do Processo (Mariana Santos — Inspetora)
1. **Chegada:** Notificação de nova solicitação externa sem contexto consolidado.
2. **Triagem:** Análise manual e verificação de antecedentes em pastas físicas/digitais.
3. **Atribuição:** Encaminhamento para a agenda do inspetor responsável.
4. **Campo & Laudo:** Realização da visita, coleta de evidências e redação técnica.
5. **Encerramento:** Envio formal do parecer ao órgão solicitante e arquivamento.

---

## 5. Priorização do Escopo (Matriz MoSCoW)

| Categoria | Funcionalidades Mapeadas no SpacFlow |
| :--- | :--- |
| **Must Have** *(Indispensável)* | Centralização de documentos, filtros de busca por processo, controle de SLA/prazos e perfis por função. |
| **Should Have** *(Importante)* | Histórico de tramitação por demanda, modelos de resposta padrão e rotina de cópias de segurança. |
| **Could Have** *(Desejável)* | Painel com indicadores gerenciais avançados e alertas de sobrecarga de trabalho. |
| **Won't Have** *(Fora do Escopo 1.0)* | Integração nativa automatizada com sistemas legados de órgãos externos. |

---

## 6. Cronograma & Roadmap por Semanas

O projeto é executado através de uma abordagem incremental dividida em 7 semanas de desenvolvimento:

| Semana / Etapa | Foco Principal | Entregas Esperadas | Status |
| :---: | :--- | :--- | :---: |
| **Semana 01**<br>*(Imersão)* | Entendimento do problema, pesquisa inicial e organização do grupo | Entregáveis para apresentação inicial | `Concluído` |
| **Semana 02**<br>*(Validação)* | Contato com a VISAT, validação de hipóteses e entendimento do processo | Hipóteses validadas e dúvidas respondidas | `Concluído` |
| **Semana 03**<br>*(Requisitos)* | Levantamento de requisitos, histórias de usuário, fluxos e priorização | Backlog priorizado e especificação inicial | `Concluído` |
| **Semana 04**<br>*(UX / UI)* | Construção de wireframes, protótipos e fluxo de navegação | Protótipo validado | `Concluído` |
| **Semana 05**<br>*(Desenvolvimento)* | Desenvolvimento incremental em sprints. Sprint 01 concluída: histórias 1 a 5 (prioridade alta e média). Sprint 02 concluída: histórias 6 a 10, mais o histórico de status e as validações do cadastro. As 10 histórias estão integradas no `main.js` | Incrementos funcionais do sistema; as demais histórias do backlog entram nas próximas sprints | `Em andamento` |
| **Semana 06**<br>*(Testes)* | Testes automatizados a cada sprint (`npm test`, hoje com 69 testes), correções de bugs registradas como Issues e validações | Versão estável do sistema | `Em andamento` |
| **Semana 07**<br>*(Entrega Final)* | Consolidação do sistema, documentação e apresentação de resultados | Entrega final do projeto | `Pendente` |

> *Nota: O cronograma é flexível e pode sofrer ajustes conforme orientações do orientador e alinhamentos das entregas semanais.*

---

## 7. Gestão Ágil & Governança Operacional

Para manter a transparência das etapas e evitar a poluição visual na rolagem da página, os artefatos de acompanhamento da equipe estão disponíveis nos painéis expansíveis abaixo:

<details>
  <summary><b>📊 Clique para expandir a Central de Backlog Refinado</b></summary>
  <br />
  <p><i>Mapeamento de Épicos, Histórias de Usuário, níveis de prioridade e rastreamento de entregas por integrante.</i></p>
  <div align="center">
    <img src="./assets/backlog.png" alt="Visão Geral do Backlog de Requisitos" width="95%" />
  </div>
</details>

<br />

<details>
  <summary><b>🎯 Clique para expandir o Quadro Kanban de Execução (Board)</b></summary>
  <br />
  <p><i>Fluxo de tarefas ativas divididas em tempo real entre Ideação, Design, Desenvolvimento, Code Review e Homologação.</i></p>
  <div align="center">
    <img src="./assets/board.png" alt="Board Kanban de Acompanhamento das Sprints" width="95%" />
  </div>
</details>

---

## 8. Corpo Técnico & Equipe do Projeto

| Avatar | Integrante | Função no Projeto | E-mail | Perfil |
| :---: | :--- | :--- | :--- | :---: |
| <img src="https://ui-avatars.com/api/?name=Antonio+Sandes&background=0D8ABC&color=fff" width="42"> | **Antonio Leite Sandes** | Gestor de Projeto | `als5@cesar.school` | [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat&logo=github)](https://github.com/als5-rgb) |
| <img src="https://ui-avatars.com/api/?name=Arthur+Tietzman&background=6f42c1&color=fff" width="42"> | **Arthur Cabral Tietzman** | Desenvolvedor | `act2@cesar.school` | [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat&logo=github)](https://github.com/ArthurCabralTietzmann) |
| <img src="https://ui-avatars.com/api/?name=Gabriel+Salvador&background=28a745&color=fff" width="42"> | **Gabriel Salvador P. da Silva Santos** | Execução e Testes | `gspss@cesar.school` | [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat&logo=github)](https://github.com/Gabriel-Salvador-1) |
| <img src="https://ui-avatars.com/api/?name=Joao+Rodrigues&background=fd7e14&color=fff" width="42"> | **João Vitor Rodrigues** | Ideação e Pesquisa | `jvrsf@cesar.school` | [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat&logo=github)](https://github.com/Rodrigues2109) |
| <img src="https://ui-avatars.com/api/?name=Matheus+Figueiredo&background=20c997&color=fff" width="42"> | **Matheus Figueiredo** | Gestor do Produto (PO) | `mffm@cesar.school` | [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat&logo=github)](https://github.com/mffm11) |
| <img src="https://ui-avatars.com/api/?name=Sergio+Bione&background=17a2b8&color=fff" width="42"> | **Sérgio Bione de Almeida Bastos** | Desenvolvedor | `sbab@cesar.school` | [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat&logo=github)](https://github.com/SBioneDev) |
| <img src="https://ui-avatars.com/api/?name=Vitor+Emmanuel&background=e83e8c&color=fff" width="42"> | **Vitor Emmanuel Fernandes** | Execução e Testes | `velfg@cesar.school` | [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat&logo=github)](https://github.com/Vitor-Emmanuel) |

---

## 9. Histórias de Usuário

Cada história tem um arquivo próprio em `src/funcionalidades/`, e o menu em `src/main.js` chama todas elas. Cada história da Sprint 02 tem uma Issue no GitHub, fechada pelo Pull Request que a entregou.

### Sprint 01

#### Prioridade alta — funcionalidades iniciais

1. **Cadastrar demanda ([`cadastrarDemanda.js`](src/funcionalidades/cadastrarDemanda.js)):** Como servidor da VISAT, quero cadastrar uma demanda, para registrar as solicitações recebidas pelo setor.
2. **Consultar demandas ([`consultarDemandas.js`](src/funcionalidades/consultarDemandas.js)):** Como integrante da VISAT, quero visualizar as demandas cadastradas, para acompanhar o andamento das solicitações.
3. **Atualizar o status da demanda ([`atualizarStatus.js`](src/funcionalidades/atualizarStatus.js)):** Como responsável por uma demanda, quero atualizar sua situação, para manter a equipe informada sobre o progresso.
4. **Definir prioridade ([`definirPrioridade.js`](src/funcionalidades/definirPrioridade.js)):** Como gestor, quero definir a prioridade de uma demanda, para identificar quais solicitações devem ser atendidas primeiro.

#### Prioridade média — funcionalidades de acompanhamento

5. **Atribuir responsável ([`atribuirResponsavel.js`](src/funcionalidades/atribuirResponsavel.js)):** Como gestor, quero indicar um responsável pela demanda, para organizar a execução das atividades da equipe.

### Sprint 02

6. **Definir prazo ([`definirPrazo.js`](src/funcionalidades/definirPrazo.js), [#17](https://github.com/SPACFlow/SPACFlow/issues/17)):** Como gestor, quero definir o prazo de uma demanda, para controlar as datas de resposta e evitar atrasos.
7. **Pesquisar demandas ([`pesquisarDemandas.js`](src/funcionalidades/pesquisarDemandas.js), [#18](https://github.com/SPACFlow/SPACFlow/issues/18)):** Como integrante da VISAT, quero pesquisar demandas por palavra, para encontrar uma solicitação sem precisar olhar a lista inteira.
8. **Filtrar por status ([`filtrarPorStatus.js`](src/funcionalidades/filtrarPorStatus.js), [#19](https://github.com/SPACFlow/SPACFlow/issues/19)):** Como integrante da VISAT, quero ver só as demandas de um status, para acompanhar o que está pendente ou em andamento.
9. **Visualizar indicadores ([`visualizarIndicadores.js`](src/funcionalidades/visualizarIndicadores.js), [#20](https://github.com/SPACFlow/SPACFlow/issues/20)):** Como gestor, quero ver os indicadores das demandas, para acompanhar a carga de trabalho e os prazos da equipe.
10. **Registrar processo SEI ([`registrarSei.js`](src/funcionalidades/registrarSei.js), [#21](https://github.com/SPACFlow/SPACFlow/issues/21)):** Como servidor da VISAT, quero registrar o número do processo SEI na demanda, para ligar a demanda ao processo oficial e facilitar a consulta.

Na Sprint 02 também entraram duas melhorias em histórias da Sprint 01: o histórico das mudanças de status na história 3 ([#13](https://github.com/SPACFlow/SPACFlow/issues/13)) e as validações do cadastro com origem, categoria e prazo na história 1 ([#9](https://github.com/SPACFlow/SPACFlow/issues/9)).

### Resumo por história

| # | História | Opção no menu | Dupla | Regras principais |
| :---: | :--- | :---: | :--- | :--- |
| 1 | Cadastrar demanda | 1 | Dupla 1 | Título (até 150 caracteres), solicitante, origem e categoria obrigatórios; prazo opcional; toda demanda nasce como *Pendente* |
| 2 | Consultar demandas | 2 | Dupla 1 | Mostra todas as demandas, com filtro por status |
| 3 | Atualizar status | 3 | Dupla 2 | Só o responsável pela demanda atualiza; demanda concluída ou cancelada não muda mais; cada mudança fica no histórico |
| 4 | Definir prioridade | 4 | Dupla 2 | Baixa, Média, Alta ou Urgente; mostra a fila da mais urgente para a menos urgente |
| 5 | Atribuir responsável | 5 | Dupla 3 | Nome obrigatório (até 100 caracteres); mostra quem saiu ao trocar o responsável |
| 6 | Definir prazo | 6 | Dupla C | Data em DD/MM/AAAA que exista e que não já passou; demanda encerrada não recebe prazo; mostra o prazo anterior ao trocar |
| 7 | Pesquisar demandas | 7 | Dupla B | Procura no título, na descrição, no solicitante, no responsável e no SEI, sem diferenciar acento e maiúscula |
| 8 | Filtrar por status | 8 | Dupla B | Aceita o status sem acento e com qualquer maiúscula; status inexistente mostra os válidos; avisa quando nenhuma demanda tem o status |
| 9 | Visualizar indicadores | 9 | Dupla A | Total de demandas, prazos vencidos, demandas sem responsável e com SEI, e contagem por status e por prioridade |
| 10 | Registrar processo SEI | 10 | Dupla C | Formato 8918.461/2026-70; não aceita ano futuro nem o mesmo SEI em outra demanda |

---
## 10. Histórias de Usuário da Sprint 02

Cada história tem um arquivo próprio em `src/funcionalidades/`, e o menu em `src/main.js` chama todas elas.

### Prioridade alta — funcionalidades de acompanhamento

6. **Definir prazo (`definirPrazo.js`)**: Como gestor, quero registrar o prazo de uma demanda, para acompanhar as datas previstas.

7. **Pesquisar demandas (`pesquisarDemandas.js`)**: Como usuário, quero pesquisar demandas, para encontrar registros com mais facilidade.

8. **Filtrar por status (`filtrarPorStatus.js`)**: Como usuário, quero filtrar as demandas por situação, para visualizar apenas aquelas que preciso acompanhar.

### Prioridade média — funcionalidades de monitoramento

9. **Visualizar indicadores (`visualizarIndicadores.js`)**: Como gestor, quero visualizar um resumo das demandas, para entender melhor o volume e a situação das solicitações.

10. **Registrar referência do processo SEI (`registrarReferenciaSEI.js`)**: Como servidor, quero registrar a referência do processo SEI relacionado à demanda, para facilitar sua localização no sistema oficial.

### Resumo por história

| # | História | Opção no menu | Dupla | Regras principais |
|---|---|---|---|---|
| 6 | Definir prazo | 6 | Dupla 3 | Prazo deve ser uma data válida; permite registrar e acompanhar a data prevista da demanda |
| 7 | Pesquisar demandas | 7 | Dupla 4 | Permite pesquisar demandas por termo, facilitando a localização de registros cadastrados |
| 8 | Filtrar por status | 8 | Dupla 4 | Permite visualizar demandas de acordo com o status: Pendente, Em andamento, Concluída ou Cancelada |
| 9 | Visualizar indicadores | 9 | Dupla 5 | Exibe um resumo das demandas cadastradas e a quantidade existente em cada situação |
| 10 | Registrar referência do processo SEI | 10 | Dupla 5 | Registra uma referência do processo SEI vinculada à demanda, facilitando sua localização no sistema oficial |

## 10. Como Executar e Testar

Requisito: [Node.js](https://nodejs.org/) 20 ou mais recente. O projeto não tem dependências externas, então não é preciso rodar `npm install`.

```bash
npm start   # abre o menu do SpacFlow no terminal
npm test    # roda os testes automatizados (testes.js)
```

Os testes usam apenas os módulos nativos `node:test` e `node:assert`. Hoje são 69 testes, todos passando. Eles cobrem as 10 histórias, com casos de sucesso e de erro e os menus de cada opção com entradas simuladas, e a integração do `main.js`, que confere se as 10 funcionalidades existem com o nome certo.

---

## 11. Relato de Pares (Pair Programming)

### Sprint 01

#### Como o trabalho foi dividido

Para evitar conflitos no Git, cada dupla trabalhou apenas nos seus arquivos e em uma branch própria. O `main.js` é o único arquivo compartilhado: ele importa a função de menu de cada história, e a Dupla 3 ficou responsável por ele. A entrega na `main` é feita por Pull Request.

| Dupla | Integrantes | Histórias | Arquivos |
| :--- | :--- | :--- | :--- |
| **Dupla 1** | Matheus e Antonio (Thony) | 1 e 2 | `cadastrarDemanda.js`, `consultarDemandas.js` |
| **Dupla 2** | Arthur e Sérgio | 3 e 4 | `atualizarStatus.js`, `definirPrioridade.js` |
| **Dupla 3** | João e Vitor (Vitinho) | 5 + integração | `atribuirResponsavel.js`, `main.js` |

#### Setup da arquitetura

Na divisão da sprint, o setup ficou com João e Thony. A estrutura foi enviada ao repositório no commit `1ba038f` (20/10), pela conta do Matheus, já com a primeira versão das histórias 1 e 2:

- `package.json` com ES Modules e o comando `npm start`;
- `src/main.js`: o menu que chama as 5 funcionalidades;
- `src/models/demanda.js`: o formato de uma demanda e as listas de status e prioridades;
- `src/repositories/demandaRepository.js`: o armazenamento das demandas em memória (gerar ID, adicionar, listar e buscar por ID);
- `src/funcionalidades/`: um arquivo por história.

O padrão combinado foi que cada arquivo tenha duas partes: uma função com a regra e as validações (por exemplo, `atribuirResponsavel`) e uma função de menu que conversa com o usuário (por exemplo, `executarAtribuirResponsavel`). O `main.js` usa só a função de menu. A função de regra pode ser testada sozinha.

#### O que cada dupla implementou

**Dupla 1 — Matheus e Thony (histórias 1 e 2)**
- `cadastrarDemanda.js`: valida título e solicitante, remove espaços extras, gera o ID e cria a demanda como *Pendente*, sem prioridade e sem responsável.
- `consultarDemandas.js`: devolve uma cópia da lista de demandas, com filtro opcional por status, e mostra uma tabela com `-` nos campos vazios.
- Na branch `grupo1`, houve uma evolução do cadastro com origem, categoria e prazo (commit `b0a0897`, Arthur). Ela entrou na `main` na Sprint 02, com ajustes (ver abaixo).

**Dupla 2 — Arthur e Sérgio (histórias 3 e 4)**
- `definirPrioridade.js` (Sérgio, `6a3e2f9`): define ou troca a prioridade aceitando texto sem acento, recusa prioridade inválida, repetida ou de demanda encerrada, e ordena a fila por prioridade, depois pela data de cadastro e por fim pelo ID.
- `atualizarStatus.js` (Arthur, `43f676d`): primeira versão com a lista de status válidos e a validação de permissão. Essa versão ainda não tinha a função de menu que o `main.js` importa, então a Dupla 3 completou a integração (ver abaixo).

**Dupla 3 — João e Vitinho (história 5 e integração)**
- `atribuirResponsavel.js` (João, `3dcf127`): lista só as demandas em aberto, valida ID, nome vazio, nome com mais de 100 caracteres e responsável repetido, e informa quem saiu quando o responsável é trocado.
- `main.js` (João, `3dcf127`; Vitinho, `98e8501` na `develop`): menu que importa as 5 funções, aceita a opção com espaços, explica opção inválida e mostra os erros de cada funcionalidade sem fechar o sistema.
- Documentação: README e imagens levados da `develop` para a `main` (`a9a4c1e`); seções de quadro e demonstração com vídeo de teste (Vitinho, `e61959f`).
- Correção da integração do `atualizarStatus.js` (João, Entrega 3): o arquivo passou a exportar `executarAtualizarStatus`, sem a qual o sistema não abria; o novo status passou a ser salvo na demanda; e foi aplicada a regra da história 3, em que só o responsável pela demanda atualiza o status. A lista de status válidos e as validações da primeira versão foram mantidas.
- `testes.js` (João, Entrega 3): testes automatizados das 5 histórias e da integração (`npm test`).

#### Interação via Pull Requests

| Etapa | Branch | O que aconteceu |
| :--- | :--- | :--- |
| [PR #1](https://github.com/SPACFlow/SPACFlow/pull/1) | `grupo2` → `main` | Aberto pela Dupla 3 com a história 5 e o `main.js`; Sérgio (Dupla 2) incluiu o `definirPrioridade.js` na mesma branch, revisou e aceitou em 21/10 |
| Merge `7d8adf8` | `grupo2` → `main` | Arthur levou para a `main` a primeira versão do `atualizarStatus.js` em 21/10 |
| [PR #2](https://github.com/SPACFlow/SPACFlow/pull/2) | `develop` → `main` | Aberto por Vitinho com ajustes de integração e o vídeo de teste; fechado sem merge, porque a integração do `main.js` entrou pelo PR #3 |
| [PR #3](https://github.com/SPACFlow/SPACFlow/pull/3) | `entrega3-ajustes` → `main` | Dupla 3 corrige a integração do `atualizarStatus.js` e adiciona os testes automatizados e esta documentação (28/10) |
| PRs [#4](https://github.com/SPACFlow/SPACFlow/pull/4), [#5](https://github.com/SPACFlow/SPACFlow/pull/5) e [#6](https://github.com/SPACFlow/SPACFlow/pull/6) | branches `docs-*` → `main` | Ajustes do README: seções renumeradas, links do board e dos vídeos e cronograma atualizado (28/10) |

### Sprint 02

#### Como o trabalho foi dividido

As duplas foram reorganizadas. A base da sprint (funções de apoio, campos novos da demanda e o menu com as opções 6 a 10) ficou com a Dupla A, e cada história ganhou uma Issue no GitHub.

| Dupla | Integrantes | Histórias | Arquivos |
| :--- | :--- | :--- | :--- |
| **Dupla A** | Matheus e Antonio (Thony) | 9 + base da sprint | `visualizarIndicadores.js`, `formatacao.js`, `main.js` |
| **Dupla B** | Arthur e Sérgio | 7 e 8 | `pesquisarDemandas.js`, `filtrarPorStatus.js` |
| **Dupla C** | João e Vitor (Vitinho) | 6 e 10 | `definirPrazo.js`, `registrarSei.js` |

#### O que cada dupla implementou

**Dupla A — Matheus e Thony (história 9 e base)**
- Base da sprint (Matheus, commits de `9f4ac64` a `5b04974`, em 04/11): `formatacao.js` com as funções de data e a tabela de demandas, os campos `prazo` e `numeroSei` na demanda, a lista `STATUS_FINAIS`, o menu com as opções 6 a 10 e os arquivos das novas histórias.
- `visualizarIndicadores.js` (Matheus, `5e79a50`): total de demandas, prazos vencidos, demandas sem responsável e com SEI, e contagem por status e por prioridade. Os testes dos indicadores foram escritos por João no PR #30.

**Dupla B — Arthur e Sérgio (histórias 7 e 8)**
- `pesquisarDemandas.js` (Sérgio, `d9e7d91`, PR #23): pesquisa por palavra no título, na descrição, no solicitante, no responsável e no SEI, sem diferenciar acento e maiúscula. A branch do PR estava em conflito com a `main` e com o arquivo no nome antigo; João fez o ajuste (`1ecb1b9`, `c3b9b41`, Issue #24), mantendo o commit original. Os testes da pesquisa foram escritos por João no PR #30.
- `filtrarPorStatus.js`: a história 8 ficou com João, que a entregou no PR #27 (`49a4979`, `dfc1b51`), com 5 testes.

**Dupla C — João e Vitinho (histórias 6 e 10)**
- `definirPrazo.js` e `registrarSei.js` (João, `c3a3516`, `b77d8bb` e `babd4cf`, PR #14): a partir do código-base combinado no grupo, com validações a mais (ID conferido antes da data, prazo no passado ou repetido, demanda encerrada, SEI com ano futuro ou repetido em outra demanda) e aviso quando o prazo ou o SEI é trocado. Os 10 testes das duas histórias entraram no `testes.js` pelo PR #29.

**Correções e melhorias (João)**
- PR #22 (`2f9c50e`, `fcbc30b`): nomes dos arquivos de pesquisa e de filtro, que impediam o sistema de abrir (#15), e teste de integração com as 10 funcionalidades (#16).
- PR #25 (`ab6629e`): remoção dos comentários do código.
- PR #28 (`eabc1eb`, `a77f641`): histórico das mudanças de status (#13) e cadastro com origem, categoria e prazo opcional (#9), a partir do código do Arthur na branch `grupo1` (`b0a0897`).

#### Interação via Pull Requests

| Etapa | Branch | O que aconteceu |
| :--- | :--- | :--- |
| Commits da base | direto na `main` | Matheus enviou a base da sprint e a história 9 em 04/11 |
| [PR #14](https://github.com/SPACFlow/SPACFlow/pull/14) | `dupla-c-prazo-sei` → `main` | Histórias 6 e 10 (Dupla C); Sérgio aceitou em 04/11 |
| [PR #22](https://github.com/SPACFlow/SPACFlow/pull/22) | `corrige-bugs-main` → `main` | Correção dos nomes dos arquivos e do teste de integração; Sérgio aceitou em 04/11 |
| [PR #23](https://github.com/SPACFlow/SPACFlow/pull/23) | `grupo2` → `main` | História 7 (Sérgio); João resolveu o conflito com a `main` e aceitou em 04/11 |
| [PR #25](https://github.com/SPACFlow/SPACFlow/pull/25) | `remove-comentarios` → `main` | Remoção dos comentários do código; João aceitou em 04/11 |
| [PR #27](https://github.com/SPACFlow/SPACFlow/pull/27) | `historia-8-filtrar-status` → `main` | História 8; João aceitou em 04/11 |
| [PR #28](https://github.com/SPACFlow/SPACFlow/pull/28) | `sprint01-issues` → `main` | Issues #9 e #13 da Sprint 01; João aceitou em 04/11 |
| [PR #29](https://github.com/SPACFlow/SPACFlow/pull/29) | `testes-historias-6-10` → `main` | Testes das histórias 6 e 10 no `testes.js`; João aceitou em 04/11 |
| [PR #30](https://github.com/SPACFlow/SPACFlow/pull/30) | `testes-historias-7-9` → `main` | Testes das histórias 7 e 9 no `testes.js` (Issues #18 e #20) |

Cada história e cada bug da Sprint 02 tem uma Issue (#15 a #24), e os Pull Requests fecham as Issues com `Closes #`.

---

## 12. Quadro Kanban de Execução (Board)

O board atualizado fica no link da seção [Rastreabilidade](#-rastreabilidade). A imagem abaixo registra o estado do quadro durante a Sprint 01.

<details>
<summary>🎯 Clique para expandir o Quadro Kanban de Execução (Board)</summary>

<br>
<p align="center">
  <img src="https://github.com/user-attachments/assets/434e906d-486b-47fd-a07f-77fd76103bec" alt="Board da Sprint" width="100%">
  <img width="688" height="777" alt="print" src="https://github.com/user-attachments/assets/00252a10-849f-4890-82a3-f214e0cd72a0" AA
    
</p>
</details>
---



## 13. Evidências e Screencasts

| Evidência | O que mostra | Link |
| :--- | :--- | :---: |
| **Vídeo da Sprint 01 (histórias 1 a 5)** | O menu funcionando de ponta a ponta: cadastrar, consultar, definir prioridade, atribuir responsável e atualizar status | [![Assistir no YouTube](https://img.shields.io/badge/Assistir-YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/jL-Aw6yKGbg) |
| **Screencast dos testes automatizados (Sprint 01)** | O comando `npm test` rodando os testes das 5 histórias e da integração | [![Assistir no YouTube](https://img.shields.io/badge/Assistir-YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/ypTrZsFt55o) |
| **Vídeo da Sprint 02 (histórias 6 a 10)** | As novas opções do menu: definir prazo, registrar processo SEI, pesquisar, filtrar por status e ver os indicadores | [![Assistir no YouTube](https://img.shields.io/badge/Assistir-YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/_C27xyH__2E) |

### Onde cada história aparece nos vídeos

Clique no tempo para abrir o vídeo direto naquele ponto.

<details>
  <summary><b>Vídeo da Sprint 01 (histórias 1 a 5)</b></summary>

- [0:00](https://youtu.be/jL-Aw6yKGbg?t=0) Abertura
- [0:14](https://youtu.be/jL-Aw6yKGbg?t=14) História 1 — Cadastrar demanda
- [1:26](https://youtu.be/jL-Aw6yKGbg?t=86) História 2 — Consultar demandas
- [1:36](https://youtu.be/jL-Aw6yKGbg?t=96) História 4 — Definir prioridade
- [2:20](https://youtu.be/jL-Aw6yKGbg?t=140) História 5 — Atribuir responsável
- [2:47](https://youtu.be/jL-Aw6yKGbg?t=167) História 3 — Atualizar status: tentativa de quem não é o responsável
- [3:09](https://youtu.be/jL-Aw6yKGbg?t=189) História 3 — Validação: só o responsável atualiza
- [3:44](https://youtu.be/jL-Aw6yKGbg?t=224) História 3 — O responsável atualiza o status
- [4:07](https://youtu.be/jL-Aw6yKGbg?t=247) Consulta final

</details>

<details>
  <summary><b>Vídeo da Sprint 02 (histórias 6 a 10)</b></summary>

- [0:00](https://youtu.be/_C27xyH__2E?t=0) Abertura
- [0:13](https://youtu.be/_C27xyH__2E?t=13) Preparação das demandas
- [0:55](https://youtu.be/_C27xyH__2E?t=55) História 6 — Definir prazo
- [07:08](https://youtu.be/_C27xyH__2E?t=428) História 10 — Registrar processo SEI
- [09:08](https://youtu.be/_C27xyH__2E?t=548) História 7 — Pesquisar demandas
- [12:14](https://youtu.be/_C27xyH__2E?t=734) História 8 — Filtrar por status
- [13:07](https://youtu.be/_C27xyH__2E?t=787) História 9 — Visualizar indicadores
- [13:39](https://youtu.be/_C27xyH__2E?t=819) Encerramento

</details>
