import { carregarTarefas } from './api.js';
import { renderizarEstado } from './estados.js';
import { instalarEventosDoQuadro } from './renderizacao.js';

const estado = {
  tarefas: [],
  busca: "",
  status: "todos",
  prioridade: "todas",
  ordenacao: "prazo-asc",
  carregamento: "carregando",
  erro: null,
};

console.log("teste")
async function iniciar() {
  renderizarEstado('carregando');

  try {
    const tarefas = await carregarTarefas();
    renderizarEstado('sucesso', tarefas);
    instalarEventosDoQuadro(document.querySelector('[data-quadro]'), tarefas);
    console.log(tarefas)
    estado.tarefas = tarefas
    console.log(estado)
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

console.log(estado.tarefas)
console.log(estado.busca)