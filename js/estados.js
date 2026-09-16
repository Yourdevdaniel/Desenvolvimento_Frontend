import { renderizarTarefas } from './renderizacao.js';

const quadro = document.querySelector('[data-quadro]');
const regiaoStatus = document.querySelector('#status');

function anunciar(texto) {
  regiaoStatus.textContent = texto;
}

export function renderizarEstado(estado, visiveis) {
  if (estado.carregamento === 'carregando') {
    renderizarTarefas([], quadro);
    anunciar('Carregando tarefas...');
    return;
  }

  if (estado.carregamento === 'erro') {
    renderizarTarefas([], quadro);
    anunciar(estado.erro);
    return;
  }

  renderizarTarefas(visiveis, quadro);

  const total = estado.tarefas.length;

  if (total === 0) {
    anunciar('Nenhuma tarefa cadastrada na origem de dados.');
    return;
  }

  if (visiveis.length === 0) {
    anunciar(`0 de ${total} tarefas. Nenhum resultado para os critérios atuais: altere a busca, os filtros ou use "Limpar filtros".`);
    return;
  }

  anunciar(`${visiveis.length} de ${total} tarefas.`);
}
