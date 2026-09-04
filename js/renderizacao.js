const ROTULOS_PRIORIDADE = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

export function criarCartao(tarefa) {
  const item = document.createElement('li');

  const cartao = document.createElement('article');
  cartao.className = 'cartao';
  cartao.dataset.tarefaId = tarefa.id;

  const topo = document.createElement('div');
  topo.className = 'cartao__topo';

  const titulo = document.createElement('button');
  titulo.type = 'button';
  titulo.className = 'cartao__titulo';
  titulo.dataset.acao = 'ver-detalhes';
  const textoTitulo = document.createElement('span');
  textoTitulo.textContent = tarefa.titulo;
  titulo.append(textoTitulo);

  const etiqueta = document.createElement('span');
  etiqueta.className = `etiqueta etiqueta--${tarefa.prioridade}`;
  etiqueta.textContent = ROTULOS_PRIORIDADE[tarefa.prioridade] ?? tarefa.prioridade;

  topo.append(titulo, etiqueta);

  const prazo = document.createElement('p');
  prazo.className = 'cartao__prazo';
  prazo.textContent = `Prazo: ${tarefa.prazo}`;

  cartao.append(topo, prazo);
  item.append(cartao);
  return item;
}

export function renderizarTarefas(tarefas, quadro) {
  const listas = quadro.querySelectorAll('[data-lista-status]');

  listas.forEach((lista) => {
    const status = lista.dataset.listaStatus;
    const tarefasDaColuna = tarefas.filter((tarefa) => tarefa.status === status);

    if (tarefasDaColuna.length === 0) {
      const vazio = document.createElement('li');
      vazio.className = 'coluna__vazio';
      vazio.textContent = 'Nenhuma tarefa nesta coluna.';
      lista.replaceChildren(vazio);
      return;
    }

    const cartoes = tarefasDaColuna.map(criarCartao);
    lista.replaceChildren(...cartoes);
  });
}

export function instalarEventosDoQuadro(quadro, tarefas) {
  quadro.addEventListener('click', (evento) => {
    if (!(evento.target instanceof Element)) return;
    const botao = evento.target.closest('button[data-acao="ver-detalhes"]');
    if (!botao || !quadro.contains(botao)) return;
    const cartao = botao.closest('[data-tarefa-id]');
    const tarefa = tarefas.find((item) => item.id === cartao?.dataset.tarefaId);
    if (!tarefa) return;
    console.log('Detalhes da tarefa:', tarefa);
  });
}
