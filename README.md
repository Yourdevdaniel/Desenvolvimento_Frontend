# Quadro de Tarefas Acadêmicas

Gerenciador de tarefas acadêmicas da disciplina Desenvolvimento Frontend (2026.2).
Daniel Bernardes.

## Aplicação publicada

https://yourdevdaniel.github.io/Desenvolvimento_Frontend/

## Como executar localmente

Os módulos JavaScript e o `fetch` do `dados.json` exigem um servidor HTTP; abrir o
`index.html` pelo sistema de arquivos não funciona.

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Arquitetura

O estado é a fonte; a tela é uma projeção.

| Arquivo | Responsabilidade |
| --- | --- |
| `js/app.js` | Objeto de estado único, ouvintes dos controles e o ciclo único de atualização |
| `js/api.js` | `carregarTarefas()`: apenas obtenção dos dados |
| `js/filtros.js` | `derivarTarefas(estado)`: busca, filtros e ordenação, sem tocar no estado |
| `js/estados.js` | Traduz o estado em cartões e na mensagem da região `role="status"` |
| `js/renderizacao.js` | Cria os cartões e instala os eventos delegados do quadro |

Cada ouvinte altera o estado e chama `atualizar()`. A lista visível é derivada uma
vez por ciclo e alimenta os cartões e a contagem "N de M tarefas".

`derivarTarefas()` filtra antes de ordenar, então o `sort()` recai sobre o array
novo devolvido pelo `filter()` e a ordem de `estado.tarefas` permanece a original.

## Publicação no GitHub Pages

Settings > Pages > Source: Deploy from a branch > `main` > `/ (root)`.
