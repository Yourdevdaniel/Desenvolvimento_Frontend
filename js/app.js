import { carregarTarefas } from './api.js';
import { renderizarEstado } from './estados.js';
import { instalarEventosDoQuadro } from './renderizacao.js';

async function iniciar() {
  renderizarEstado('carregando');

  try {
    const tarefas = await carregarTarefas();
    renderizarEstado('sucesso', tarefas);
    instalarEventosDoQuadro(document.querySelector('[data-quadro]'), tarefas);
  } catch (erro) {
    if (erro.name === 'TypeError') {
      renderizarEstado('erro', 'Falha de rede. Verifique sua conexão e tente novamente.');
    } else if (erro.name === 'SyntaxError') {
      renderizarEstado('erro', 'Os dados recebidos estão em um formato inválido.');
    } else {
      renderizarEstado('erro', erro.message);
    }
  }
}

iniciar();
