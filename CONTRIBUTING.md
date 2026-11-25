# Como contribuir com o SpacFlow

Este guia reúne o que é preciso para rodar o projeto e o caminho que toda mudança segue até a `main`.

## 1. Preparar a máquina

- [Node.js](https://nodejs.org/) 20 ou mais recente. Confira com `node --version`.
- O projeto não tem dependências externas: não é preciso rodar `npm install`.

```bash
git clone https://github.com/SPACFlow/SPACFlow.git
cd SPACFlow
```

## 2. Rodar e testar

| Comando | O que faz |
| :--- | :--- |
| `npm start` | Abre o menu do SpacFlow no terminal, com as 15 opções |
| `npm run web` | Abre a interface web em http://localhost:3000 |
| `npm test` | Roda os testes automatizados do `testes.js` |

Antes de abrir um Pull Request, rode `npm test`: nenhum teste pode falhar.

## 3. Onde fica cada coisa

| Pasta ou arquivo | Conteúdo |
| :--- | :--- |
| `src/main.js` | Menu do terminal; importa uma função `executar...` de cada história |
| `src/funcionalidades/` | Uma história por arquivo, com a regra e a função do menu |
| `src/models/`, `src/repositories/`, `src/utils/` | Modelo da demanda, armazenamento e formatação de datas e tabelas |
| `src/interface/` | Interface web: cada história tem o seu arquivo em `funcionalidades/` |
| `testes.js` | Testes de todas as histórias, um bloco `describe` por história |

## 4. Caminho de uma mudança

Nada vai direto para a `main`. Toda mudança segue estes passos:

1. **Issue primeiro.** Abra a Issue antes de começar, com o modelo certo (História, Bug ou Tarefa), na milestone da sprint. Bug encontrado vira Issue na hora, não no fim da sprint.
2. **Branch própria**, criada a partir da `main` atualizada:
   ```bash
   git switch main
   git pull
   git switch -c historia-14-indicadores-origem
   ```
3. **Commits pequenos**, separando código e testes.
4. **Pull Request** para a `main`, usando o modelo do repositório, com `Closes #N` para fechar a Issue.
5. **Revisão** de alguém de outra dupla. O merge só acontece depois da aprovação.

### Nome da branch

Letras minúsculas, sem acento, palavras separadas por hífen, começando pelo tipo de mudança:

| Tipo | Exemplo |
| :--- | :--- |
| História | `historia-12-concluir-demanda` |
| Testes | `testes-historias-11-13` |
| Correção de bug | `corrige-status-interface` |
| Interface web | `interface-prazo-sei` |
| Documentação | `readme-board-html`, `contributing` |

### Mensagem de commit

Em português, no presente, dizendo o que o commit faz em até 72 caracteres. Se precisar explicar o porquê, deixe uma linha em branco e escreva depois.

```text
Conclui a demanda com resultado e data de conclusão
Adiciona os testes da história 12
Corrige o status dos exemplos da interface
```

### Pull Request

- Título dizendo o que muda, por exemplo `História 14: indicadores por origem e categoria`.
- Preencha as seções do modelo: **O que muda**, **Issue** (`Closes #N`), **Quem fez** (quem programou e quem revisou) e **Como conferir**.
- Um PR por assunto. Se a mudança cresceu, divida em mais de um.

## 5. Padrões do código

- JavaScript com ES Modules (`import` e `export`), sem bibliotecas externas.
- Nomes de funções, variáveis e mensagens em português.
- Sem comentários no código: o nome das funções e variáveis deve explicar o que fazem.
- Cada história expõe uma função com a regra (que lança `Error` com uma mensagem clara) e uma função `executar...` para o menu.
- Toda história nova ou corrigida entra com testes no `testes.js`, cobrindo o caso de sucesso, os erros e o menu.

## 6. Dúvidas

Abra uma Issue com o modelo **Tarefa** ou fale com a equipe no grupo.
