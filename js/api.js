const dados = {};
function criarCartao(tarefa) {
  const cartao = document.createElement("article");
  cartao.className = "cartao";
  cartao.dataset.tarefaId = tarefa.id;

  const titulo = document.createElement("h4");
  const status = document.createElement("p");
  const prioridade = document.createElement("p");
  const prazo = document.createElement("p");
  titulo.textContent = tarefa.titulo;
  prioridade.textContent = tarefa.prioridade;
  prazo.textContent = tarefa.prazo;
  cartao.append(titulo);
  cartao.append(prioridade);
  cartao.append(prazo);
  return cartao;
}

async function carregarTarefas() {
  event.preventDefault()
  try {
    const resposta = await fetch("./dados.json");
    const data = await resposta.json();
    const a_fazer = document.querySelector('#coluna-a-fazer')
    const em_andamento = document.querySelector('#coluna-em-andamento')
    const em_revisao = document.querySelector('#coluna-em-revisao')
    const concluida = document.querySelector('#coluna-concluida')
    if (!resposta.ok) {
      throw new Error(`Resposta HTTP ${resposta.status}`);
    } else if (!data.tarefas || data.tarefas.length === 0) {
      throw new Error("A api esta vazia");
    }
    for (let i = 0; i < data.tarefas.length; i++) {
      Object.assign(dados, { [data.tarefas[i].id]: data.tarefas[i] });
    }
    for (let index = 0; index < data.tarefas.length; index++) {
        if (data.tarefas[index].status.includes("fazer")) {
            const lista = document.querySelector("#listaFazer");
            const li = document.createElement("li");
            li.append(criarCartao(data.tarefas[index]));
            lista.append(li);
        } else if (data.tarefas[index].status.includes("andamento")) {
            const lista = document.querySelector("#listaAndamento");
            const li = document.createElement("li");
            li.append(criarCartao(data.tarefas[index]));
            lista.append(li);
        } else if (data.tarefas[index].status.includes("revisao")) {
            const lista = document.querySelector("#listaRevisao");
            const li = document.createElement("li");
            li.append(criarCartao(data.tarefas[index]));
            lista.append(li);
        } else if (data.tarefas[index].status.includes("concluido")) {
            const lista = document.querySelector("#listaConcluida");
            const li = document.createElement("li");
            li.append(criarCartao(data.tarefas[index]));
            lista.append(li);            
        }
    
    }
  } catch (error) {
    console.log("Erro:", error);
  }
}
