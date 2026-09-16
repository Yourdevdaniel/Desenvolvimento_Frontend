import { carregarTarefas } from './api.js';
import { derivarTarefas } from './filtros.js';
import { renderizarEstado } from './estados.js';
import { instalarEventosDoQuadro, ROTULOS_STATUS } from './renderizacao.js';

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
  aviso: '',
  ultimaConclusao: null,
};

const formulario = document.querySelector('.filtros');
const campoBusca = document.querySelector('#campo-busca');
const campoOrdenacao = document.querySelector('#campo-ordenacao');
const botaoLimpar = document.querySelector('[data-limpar]');
const quadro = document.querySelector('[data-quadro]');
const dialogo = document.querySelector('[data-dialogo]');

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

function avisarEAtualizar(aviso) {
  estado.aviso = aviso;
  atualizar();
  estado.aviso = '';
}

function concluirTarefa(id) {
  const tarefa = estado.tarefas.find((item) => item.id === id);
  if (!tarefa) return;
  estado.ultimaConclusao = { id, statusAnterior: tarefa.status };
  tarefa.status = 'concluida';
  const concluidas = estado.tarefas.filter((item) => item.status === 'concluida').length;
  avisarEAtualizar(`"${tarefa.titulo}" concluída. Agora são ${concluidas} tarefas concluídas. Para desfazer, use o botão Costurar de volta.`);
}

function desfazerConclusao() {
  const ultima = estado.ultimaConclusao;
  const tarefa = estado.tarefas.find((item) => item.id === ultima?.id);
  if (!tarefa) return null;
  estado.ultimaConclusao = null;
  tarefa.status = ultima.statusAnterior;
  tarefa.costurada = Date.now();
  avisarEAtualizar(`"${tarefa.titulo}" costurada de volta em ${ROTULOS_STATUS[tarefa.status]}.`);
  return tarefa.id;
}

instalarEventosDoQuadro(quadro, dialogo, () => estado.tarefas, {
  concluir: concluirTarefa,
  desfazer: desfazerConclusao,
});

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
