export function derivarTarefas(estado) {
  const busca = estado.busca.trim().toLowerCase();

  const filtradas = estado.tarefas.filter((tarefa) => {
    const casaBusca = busca === '' || tarefa.titulo.toLowerCase().includes(busca);
    const casaStatus = estado.status === 'todos' || tarefa.status === estado.status;
    const casaPrioridade = estado.prioridade === 'todas' || tarefa.prioridade === estado.prioridade;
    return casaBusca && casaStatus && casaPrioridade;
  });

  const direcao = estado.ordenacao === 'prazo-desc' ? -1 : 1;
  return filtradas.sort((a, b) => direcao * a.prazo.localeCompare(b.prazo));
}
