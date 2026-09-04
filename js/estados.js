import { renderizarTarefas } from './renderizacao.js';

const quadro = document.querySelector('[data-quadro]');
const regiaoStatus = document.querySelector('#status');

function limparContainer() {
  renderizarTarefas([], quadro);
}

function anunciar(texto) {
  regiaoStatus.textContent = texto;
}

function mostrarCarregando() {
  limparContainer();
  anunciar('Carregando tarefas...');
}

function mostrarSucesso(tarefas) {
  renderizarTarefas(tarefas, quadro);
  anunciar(`${tarefas.length} tarefa(s) carregada(s).`);
}

function mostrarVazio() {
  limparContainer();
  anunciar('Nenhuma tarefa encontrada.');
}

function mostrarErro(mensagem) {
  limparContainer();
  anunciar(mensagem);
}

export function renderizarEstado(estado, dados) {
  switch (estado) {
    case 'carregando':
      mostrarCarregando();
      break;
    case 'sucesso':
      if (dados.length === 0) {
        mostrarVazio();
      } else {
        mostrarSucesso(dados);
      }
      break;
    case 'vazio':
      mostrarVazio();
      break;
    case 'erro':
      mostrarErro(dados);
      break;
    default:
      throw new Error(`Estado desconhecido: ${estado}`);
  }
}
