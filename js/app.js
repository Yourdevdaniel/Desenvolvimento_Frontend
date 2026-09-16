import { carregarTarefas } from './api.js';
import { derivarTarefas } from './filtros.js';
import { renderizarEstado } from './estados.js';
import { instalarEventosDoQuadro } from './renderizacao.js';

const CRITERIOS_INICIAIS = {
  busca: '',
  status: 'todos',
  prioridade: 'todas',
  ordenacao: 'prazo-asc',
};

const estado = {
  tarefas: [],
  ...CRITERIOS_INICIAIS,
  carregamento: 'carregando',
  erro: null,
};

const formulario = document.querySelector('.filtros');
const campoBusca = document.querySelector('#campo-busca');
const campoOrdenacao = document.querySelector('#campo-ordenacao');
const botaoLimpar = document.querySelector('[data-limpar]');
const quadro = document.querySelector('[data-quadro]');

function atualizar() {
  renderizarEstado(estado, derivarTarefas(estado));
}

function mensagemDeErro(erro) {
  if (erro.name === 'TypeError') {
    return 'Falha de rede. Verifique sua conexão e tente novamente.';
  }
  if (erro.name === 'SyntaxError') {
    return 'Os dados recebidos estão em um formato inválido.';
  }
  return erro.message;
}

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
});

campoBusca.addEventListener('input', () => {
  estado.busca = campoBusca.value;
  atualizar();
});

formulario.addEventListener('change', (evento) => {
  const alvo = evento.target;

  if (alvo.name === 'status') {
    estado.status = alvo.value;
  } else if (alvo.name === 'prioridade') {
    estado.prioridade = alvo.value;
  } else if (alvo.name === 'ordenacao') {
    estado.ordenacao = alvo.value;
  } else {
    return;
  }

  atualizar();
});

botaoLimpar.addEventListener('click', () => {
  Object.assign(estado, CRITERIOS_INICIAIS);
  campoBusca.value = CRITERIOS_INICIAIS.busca;
  campoOrdenacao.value = CRITERIOS_INICIAIS.ordenacao;
  formulario.querySelector(`input[name="status"][value="${CRITERIOS_INICIAIS.status}"]`).checked = true;
  formulario.querySelector(`input[name="prioridade"][value="${CRITERIOS_INICIAIS.prioridade}"]`).checked = true;
  atualizar();
});

instalarEventosDoQuadro(quadro, () => estado.tarefas);

async function iniciar() {
  atualizar();

  try {
    estado.tarefas = await carregarTarefas();
    estado.carregamento = 'sucesso';
    estado.erro = null;
  } catch (erro) {
    estado.carregamento = 'erro';
    estado.erro = mensagemDeErro(erro);
  }

  atualizar();
}

iniciar();
