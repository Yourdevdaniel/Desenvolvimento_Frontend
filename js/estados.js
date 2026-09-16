import { renderizarRegua, renderizarTarefas } from './renderizacao.js';
import { situacao } from './prazos.js';

const quadro = document.querySelector('[data-quadro]');
const trilho = document.querySelector('[data-regua]');
const regiaoStatus = document.querySelector('#status');
const resumo = {
  total: document.querySelector('[data-resumo="total"]'),
  atrasadas: document.querySelector('[data-resumo="atrasadas"]'),
  concluidas: document.querySelector('[data-resumo="concluidas"]'),
};

function atualizarResumo(tarefas) {
  resumo.total.textContent = tarefas.length;
  resumo.atrasadas.textContent = tarefas.filter((tarefa) => situacao(tarefa).tipo === 'atrasada').length;
  resumo.concluidas.textContent = tarefas.filter((tarefa) => tarefa.status === 'concluida').length;
}

export function renderizarEstado(estado, visiveis) {
  const anunciar = (texto) => {
    regiaoStatus.textContent = estado.aviso ? `${estado.aviso} ${texto}` : texto;
  };

  if (estado.carregamento === 'carregando') {
    renderizarTarefas([], quadro, 'Carregando…');
    anunciar('Carregando tarefas…');
    return;
  }

  if (estado.carregamento === 'erro') {
    renderizarTarefas([], quadro, 'Sem dados.');
    anunciar(estado.erro);
    return;
  }

  const total = estado.tarefas.length;
  atualizarResumo(estado.tarefas);
  renderizarRegua(estado.tarefas, visiveis, trilho);

  if (total === 0) {
    renderizarTarefas([], quadro);
    anunciar('Nenhuma tarefa cadastrada na origem de dados.');
    return;
  }

  renderizarTarefas(visiveis, quadro);

  if (visiveis.length === 0) {
    anunciar(`0 de ${total} tarefas. Nenhum resultado para os critérios atuais: altere a busca, os filtros ou use "Limpar filtros".`);
    return;
  }

  anunciar(`${visiveis.length} de ${total} tarefas.`);
}
