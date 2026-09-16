const UM_DIA = 86400000;

const formatoCurto = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const formatoLongo = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
});

function paraMilissegundos(data) {
  return Date.parse(`${data}T00:00:00Z`);
}

export function hoje() {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

export function diasEntre(inicio, fim) {
  return Math.round((paraMilissegundos(fim) - paraMilissegundos(inicio)) / UM_DIA);
}

export function somarDias(data, dias) {
  return new Date(paraMilissegundos(data) + dias * UM_DIA).toISOString().slice(0, 10);
}

export function dataCurta(data) {
  return formatoCurto.format(paraMilissegundos(data)).replace(' de ', ' ').replace('.', '');
}

export function dataLonga(data) {
  return formatoLongo.format(paraMilissegundos(data));
}

export function situacao(tarefa, referencia = hoje()) {
  if (tarefa.status === 'concluida') {
    return { tipo: 'entregue', texto: 'Entregue' };
  }

  const dias = diasEntre(referencia, tarefa.prazo);

  if (dias < 0) {
    return { tipo: 'atrasada', texto: dias === -1 ? 'Atrasada há 1 dia' : `Atrasada há ${-dias} dias` };
  }
  if (dias === 0) return { tipo: 'urgente', texto: 'Entrega hoje' };
  if (dias === 1) return { tipo: 'urgente', texto: 'Entrega amanhã' };
  return { tipo: dias <= 3 ? 'urgente' : 'folga', texto: `Faltam ${dias} dias` };
}
