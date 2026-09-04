export async function carregarTarefas() {
  const resposta = await fetch('./dados.json');

  if (!resposta.ok) {
    throw new Error(`Falha ao buscar tarefas: HTTP ${resposta.status}`);
  }

  const corpo = await resposta.json();
  return corpo.tarefas;
}
