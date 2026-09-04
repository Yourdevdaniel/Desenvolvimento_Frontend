async function carregarTarefas() {
  const resposta = await fetch("./dados.json");

  if (!resposta.ok) {
    throw new Error(`Resposta HTTP ${resposta.status}`);
  }

  const data = await resposta.json();

  if (!data.tarefas || data.tarefas.length === 0) {
    throw new Error("A api esta vazia");
  }

  return data.tarefas;
}
