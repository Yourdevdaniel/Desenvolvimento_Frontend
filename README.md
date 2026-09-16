# Quadro de Tarefas Acadêmicas (versão 1)

Gerenciador de tarefas acadêmicas da disciplina Desenvolvimento Frontend (2026.2).
Daniel Bernardes.

Releitura da atividade original com identidade visual de quadro de missões de
taverna: parede de madeira, tarefas como pergaminhos, prioridade em selo de cera, sem frameworks nem dependências: HTML, CSS e
JavaScript nativos, fontes do sistema.

## O que mudou em relação à versão original

- **Mapa dos prazos:** pergaminho com trilha, rosa dos ventos, bandeira em hoje e um selo por tarefa
  visível; as marcas somem e se reorganizam conforme busca e filtros.
- **Resumo:** total, atrasadas e concluídas no cabeçalho.
- **Situação do prazo:** cada cartão mostra "Atrasada há N dias", "Entrega hoje",
  "Faltam N dias" ou "Entregue".
- **Detalhes:** clicar no título abre um `<dialog>` nativo (antes, `console.log`).
- **Concluir e desfazer:** o diálogo conclui a tarefa com um machado que parte o pergaminho e
  fica cravado na madeira; o pergaminho voa enrolado até "Concluída", desenrola e recebe um lacre
  de cera. O bilhete "Costurar de volta" desfaz: uma agulha costura as metades e a linha desbota.
- **Filtros em etiquetas:** rádios nativos acessíveis por teclado.
- **Taverna envelhecida:** madeira e pergaminho com rachaduras, dobras, manchas de
  caneca e bordas queimadas, tudo em gradientes e SVG embutido no CSS, sem imagens.
- **Balcão e armas:** filtros num balcão com velas acesas, moedas, dado e caneca; barris no rodapé; machados cruzados sobre escudo
  na placa do cabeçalho, desenhados em SVG inline.

## Aplicação publicada

(publicar este repositório e colocar a URL aqui)

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
| `js/renderizacao.js` | Cria os cartões, a régua de prazos e instala os eventos do quadro e do diálogo |
| `js/prazos.js` | Datas: dias até o prazo, situação da tarefa e formatação em pt-BR |

Cada ouvinte altera o estado e chama `atualizar()`. A lista visível é derivada uma
vez por ciclo e alimenta os cartões e a contagem "N de M tarefas".

`derivarTarefas()` filtra antes de ordenar, então o `sort()` recai sobre o array
novo devolvido pelo `filter()` e a ordem de `estado.tarefas` permanece a original.

## Publicação no GitHub Pages

Settings > Pages > Source: Deploy from a branch > `main` > `/ (root)`.
