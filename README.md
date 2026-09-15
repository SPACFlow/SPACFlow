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

## 📌 Sumário Navegável
* [1. Visão Geral & Impacto Institucional](#1-visão-geral--impacto-institucional)
* [2. Diagnóstico Operacional: Antes vs. SpacFlow](#2-diagnóstico-operacional-antes-vs-spacflow)
* [3. Prototipação do produto](#3-prototipação-do-produto)
* [4. Mapeamento de Usuário (Persona & Jornada)](#4-mapeamento-de-usuário-persona--jornada)
* [5. Priorização do Escopo (Matriz MoSCoW)](#5-priorização-do-escopo-matriz-moscow)
* [6. Cronograma & Roadmap por Semanas](#6-cronograma--roadmap-por-semanas)
* [7. Gestão Ágil & Governança Operacional](#7-gestão-ágil--governança-operacional)
* [8. Corpo Técnico & Equipe do Projeto](#8-corpo-técnico--equipe-do-projeto)
* [9. Arquitetura do Fluxo (Mermaid.js)](#9-arquitetura-do-fluxo-mermaidjs)

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
  <p><i>Gravação em vídeo demonstrando a navegação pelo protótipo.</i></p>
  <div align="center">
    <p><i>(link ou embed do screencast)</i></p>
  </div>
</details>

<br />

<details>
  <summary><b>✏️ Clique para expandir os Sketches/Storyboard</b></summary>
  <br />
  <p><i>Esboços e storyboards feitos a mão para cada história de usuário mapeada.</i></p>
  <div align="center">
    <img src="./assets/storyboard_epicos.png" alt="Storyboard dos Épicos — SpacFlow" width="95%" />
  </div>
</details>

<br />

<details>
  <summary><b>🔗 Clique para expandir os Diagramas de Atividade</b></summary>
  <br />
  <p><i>Diagramas de atividade correspondentes a cada história de usuário.</i></p>
  <div align="center">
    <p><i>(link ou imagem dos diagramas de atividade)</i></p>
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
| **Semana 04**<br>*(UX / UI)* | Construção de wireframes, protótipos e fluxo de navegação | Protótipo validado | `Pendente` |
| **Semana 05**<br>*(Desenvolvimento)* | Banco de dados (PostgreSQL), backend, frontend e integração | Incrementos funcionais do sistema | `Pendente` |
| **Semana 06**<br>*(Testes)* | Testes de software, correções de bugs e validações | Versão estável do sistema | `Pendente` |
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
| <img src="https://ui-avatars.com/api/?name=Sergio+Bione&background=17a2b8&color=fff" width="42"> | **Sérgio Bione de Almeida Bastos** | Desenvolvedor | `sbab@cesar.school` | [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat&logo=github)](https://github.com/S-Bione) |
| <img src="https://ui-avatars.com/api/?name=Vitor+Emmanuel&background=e83e8c&color=fff" width="42"> | **Vitor Emmanuel Fernandes** | Execução e Testes | `velfg@cesar.school` | [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat&logo=github)](https://github.com/Vitor-Emmanuel) |

---

## 9. Arquitetura do Fluxo (Mermaid.js)

```mermaid
graph LR
    A["Órgão Demandante (MPT / TRT)"] -->|"Ofício / Demanda"| B["SpacFlow: Entrada"]
    B --> C{"Triagem & SLA"}
    C -->|"Atribuição"| D["Inspetor Técnico"]
    D -->|"Inspeção & Laudo"| E["Emissão de Parecer"]
    E --> F{"Aprovação da Gestão"}
    F -->|"Aprovado"| G["Retorno ao Órgão Solicitante"]
    F -->|"Ajuste"| D
```