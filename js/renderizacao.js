import { dataCurta, dataLonga, diasEntre, hoje, situacao, somarDias } from './prazos.js';

export const ROTULOS_PRIORIDADE = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

export const ROTULOS_STATUS = {
  'a-fazer': 'A fazer',
  'em-andamento': 'Em andamento',
  'em-revisao': 'Em revisão',
  concluida: 'Concluída',
};

function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);
  if (classe) elemento.className = classe;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

const PONTOS = [47, 43.5, 48.6, 47.8, 42, 46.9, 48.3, 43.4, 46.1].map((x, i) => [x, 4 + i * 11]);

const SVG_MACHADO = '<svg viewBox="-30 -115 105 175" aria-hidden="true" focusable="false"><use href="#machado"/></svg>';

const SVG_AGULHA = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">'
  + '<path d="M20 4c4-2 3 7-2 9s-9 2-13 0" stroke="#8f1a1a" stroke-width="1.3"/>'
  + '<path d="M1 23L20 4" stroke="#d8d0c2" stroke-width="2.2"/>'
  + '<path d="M17.2 6.8l2-2" stroke="#4a4038" stroke-width="0.8"/>'
  + '</svg>';

const LACRE = '<span class="lacre" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M6 12.5l4 4L18 8"/></svg></span>';

function costura(costuradaEm) {
  return `<svg class="costura" style="--desbote:${1500 - (Date.now() - costuradaEm)}ms" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">`
    + '<path class="costura__rasgo" d="M53 0L47 16L55 33L46 50L54 68L47 84L52 100"/>'
    + PONTOS.map(([x, y], i) => `<path class="costura__linha" style="--i:${i}" d="M${x} ${y}l8 4"/>`).join('')
    + '</svg>';
}

export function criarCartao(tarefa) {
  const item = document.createElement('li');
  const { tipo, texto } = situacao(tarefa);

  const cartao = criarElemento('article', `cartao cartao--${tipo}`);
  cartao.dataset.tarefaId = tarefa.id;

  const etiqueta = criarElemento(
    'span',
    `marca marca--${tarefa.prioridade}`,
    ROTULOS_PRIORIDADE[tarefa.prioridade] ?? tarefa.prioridade,
  );

  const titulo = criarElemento('button', 'cartao__titulo', tarefa.titulo);
  titulo.type = 'button';
  titulo.dataset.acao = 'ver-detalhes';

  const rodape = criarElemento('p', 'cartao__rodape');
  const prazo = criarElemento('time', 'cartao__prazo', dataCurta(tarefa.prazo));
  prazo.dateTime = tarefa.prazo;
  rodape.append(prazo, criarElemento('span', 'cartao__situacao', texto));

  cartao.append(etiqueta, titulo, rodape);
  if (tarefa.status === 'concluida') cartao.insertAdjacentHTML('beforeend', LACRE);
  if (tarefa.costurada) cartao.insertAdjacentHTML('beforeend', costura(tarefa.costurada));
  item.append(cartao);
  return item;
}

export function renderizarTarefas(tarefas, quadro, textoVazio = 'Nenhum pergaminho pregado aqui.') {
  quadro.querySelectorAll('[data-lista-status]').forEach((lista) => {
    const status = lista.dataset.listaStatus;
    const daColuna = tarefas.filter((tarefa) => tarefa.status === status);

    quadro.querySelector(`[data-contador="${status}"]`).textContent = daColuna.length;

    if (daColuna.length === 0) {
      lista.replaceChildren(criarElemento('li', 'coluna__vazio', textoVazio));
      return;
    }

    lista.replaceChildren(...daColuna.map(criarCartao));
  });
}

function construirRegua(tarefas, trilho) {
  const referencia = hoje();
  const datas = [...tarefas.map((tarefa) => tarefa.prazo), referencia].sort();
  const inicio = somarDias(datas[0], -2);
  const totalDias = diasEntre(inicio, somarDias(datas.at(-1), 2));
  const posicao = (data) => (diasEntre(inicio, data) / totalDias) * 100;

  trilho.style.setProperty('--dias', totalDias);

  const hojeMarca = criarElemento('span', 'regua__hoje');
  hojeMarca.dataset.rotulo = `Hoje, ${dataCurta(referencia)}`;
  hojeMarca.style.setProperty('--x', posicao(referencia));

  const rotulos = [];
  for (let dia = 2; dia < totalDias; dia += 7) {
    const data = somarDias(inicio, dia);
    const rotulo = criarElemento('span', 'regua__rotulo', dataCurta(data));
    rotulo.style.setProperty('--x', posicao(data));
    rotulos.push(rotulo);
  }

  const marcas = tarefas.map((tarefa, ordem) => {
    const marca = criarElemento('span', `regua__marca marca--${tarefa.prioridade}`);
    marca.dataset.tarefaId = tarefa.id;
    marca.dataset.prazo = tarefa.prazo;
    marca.title = `${tarefa.titulo} (${dataCurta(tarefa.prazo)})`;
    marca.style.setProperty('--x', posicao(tarefa.prazo));
    marca.style.setProperty('--ordem', ordem);
    return marca;
  });

  trilho.replaceChildren(...rotulos, hojeMarca, ...marcas);
  trilho.dataset.construida = 'sim';

  const rolagem = trilho.parentElement;
  rolagem.scrollLeft = hojeMarca.offsetLeft - rolagem.clientWidth / 2;
}

export function renderizarRegua(tarefas, visiveis, trilho) {
  if (tarefas.length === 0) {
    trilho.replaceChildren();
    delete trilho.dataset.construida;
    return;
  }

  if (!trilho.dataset.construida) construirRegua(tarefas, trilho);

  const idsVisiveis = new Set(visiveis.map((tarefa) => tarefa.id));
  const pilhaPorData = {};

  trilho.querySelectorAll('.regua__marca').forEach((marca) => {
    const visivel = idsVisiveis.has(marca.dataset.tarefaId);
    marca.toggleAttribute('data-oculta', !visivel);
    if (!visivel) return;
    const pilha = pilhaPorData[marca.dataset.prazo] ?? 0;
    pilhaPorData[marca.dataset.prazo] = pilha + 1;
    marca.style.setProperty('--pilha', pilha);
  });
}

const semMovimento = matchMedia('(prefers-reduced-motion: reduce)');

function criarMetades(cartao, ...classes) {
  return ['esquerda', 'direita'].map((lado) => {
    const metade = cartao.cloneNode(true);
    metade.classList.add('metade', `metade--${lado}`, ...classes);
    metade.removeAttribute('data-tarefa-id');
    metade.querySelector('.costura')?.remove();
    return metade;
  });
}

function arremessarMachado(quadro, id) {
  const cartao = quadro.querySelector(`.cartao[data-tarefa-id="${id}"]`);
  if (!cartao || semMovimento.matches) return Promise.resolve();

  const item = cartao.parentElement;
  const caixa = item.getBoundingClientRect();
  const origem = {
    x: caixa.left + caixa.width / 2 + scrollX,
    y: caixa.top + caixa.height / 2 + scrollY,
    largura: caixa.width,
    altura: caixa.height,
    lista: item.parentElement,
    indice: [...item.parentElement.children].indexOf(item),
  };
  const metades = criarMetades(cartao);

  const machado = criarElemento('span', 'machado-voador');
  machado.innerHTML = `<span class="machado-voador__arco">${SVG_MACHADO}</span>`;

  const farpas = Array.from({ length: 10 }, (_, indice) => {
    const farpa = criarElemento('span', 'farpa');
    const angulo = (indice / 10) * Math.PI * 2 + Math.random() * 0.6;
    const distancia = 2.5 + Math.random() * 2.5;
    farpa.style.setProperty('--dx', `${Math.cos(angulo) * distancia}rem`);
    farpa.style.setProperty('--dy', `${Math.sin(angulo) * distancia}rem`);
    farpa.style.setProperty('--giro', `${Math.random() * 540 - 270}deg`);
    return farpa;
  });

  item.classList.add('rasgando');
  item.append(...metades, criarElemento('span', 'poeira'), ...farpas, machado);
  return new Promise((resolve) => setTimeout(() => {
    const m = machado.getBoundingClientRect();
    const c = item.getBoundingClientRect();
    origem.machado = { left: m.left - c.left, top: m.top - c.top, width: m.width };
    resolve(origem);
  }, 1250));
}

function deixarVaga({ lista, indice, altura, machado }) {
  const vaga = criarElemento('li', 'coluna__vazio vaga');
  vaga.setAttribute('aria-hidden', 'true');
  vaga.style.setProperty('--altura', `${altura}px`);
  const cravado = criarElemento('span', 'machado-cravado');
  cravado.innerHTML = SVG_MACHADO;
  Object.assign(cravado.style, { left: `${machado.left}px`, top: `${machado.top}px`, width: `${machado.width}px` });
  vaga.append(cravado);
  vaga.addEventListener('animationend', (evento) => {
    if (evento.animationName === 'fechar-vaga') vaga.remove();
  });
  lista.insertBefore(vaga, lista.children[indice] ?? null);
}

function carimbar(item) {
  const selo = item.querySelector('.lacre');
  if (!selo) return;
  const a = selo.getBoundingClientRect();
  const b = item.getBoundingClientRect();
  const carimbo = criarElemento('span', 'carimbo');
  carimbo.innerHTML = '<span class="carimbo__cabo"></span><span class="carimbo__base"></span>';
  Object.assign(carimbo.style, { left: `${a.left - b.left + a.width / 2}px`, top: `${a.bottom - b.top}px`, width: `${a.width + 8}px` });
  carimbo.addEventListener('animationend', (evento) => {
    if (evento.animationName === 'sumir') carimbo.remove();
  });
  item.append(carimbo);
}

function voarRolo(origem, item) {
  const destino = item.getBoundingClientRect();
  const dx = origem.x - scrollX - (destino.left + destino.width / 2);
  const dy = origem.y - scrollY - (destino.top + 8);
  const altura = Math.min(96, Math.hypot(dx, dy) / 3);

  const rolo = criarElemento('span', 'rolo-voador');
  const arco = criarElemento('span', 'rolo-voador__arco');
  rolo.append(arco);
  Object.assign(rolo.style, { left: `calc(${destino.left}px - 0.25rem)`, top: `${destino.top}px`, width: `calc(${destino.width}px + 0.5rem)` });
  document.body.append(rolo);

  arco.animate([
    { transform: 'translateY(0)', easing: 'cubic-bezier(0.2, 0.6, 0.4, 1)' },
    { transform: `translateY(${-altura}px)`, offset: 0.45, easing: 'cubic-bezier(0.6, 0, 0.8, 0.4)' },
    { transform: 'translateY(0)' },
  ], 560);
  rolo.animate({ opacity: [0, 1] }, 100);
  const voo = rolo.animate([
    { transform: `translate(${dx}px, ${dy}px) rotate(-8deg) scaleX(${origem.largura / destino.width})` },
    { transform: 'none' },
  ], { duration: 560, easing: 'cubic-bezier(0.45, 0, 0.2, 1)' });
  return new Promise((resolve) => {
    voo.onfinish = () => {
      rolo.remove();
      resolve();
    };
  });
}

function preencherDetalhes(dialogo, tarefa) {
  const campos = {
    status: ROTULOS_STATUS[tarefa.status] ?? tarefa.status,
    titulo: tarefa.titulo,
    prioridade: ROTULOS_PRIORIDADE[tarefa.prioridade] ?? tarefa.prioridade,
    prazo: dataLonga(tarefa.prazo),
    situacao: situacao(tarefa).texto,
  };

  Object.entries(campos).forEach(([campo, valor]) => {
    dialogo.querySelector(`[data-detalhes="${campo}"]`).textContent = valor;
  });
  dialogo.dataset.status = tarefa.status;
  dialogo.dataset.tarefaId = tarefa.id;
  dialogo.querySelector('[data-concluir]').hidden = tarefa.status === 'concluida';
}

function costurarDeVolta(quadro, id) {
  const cartao = quadro.querySelector(`.cartao[data-tarefa-id="${id}"]`);
  if (!cartao) return;
  cartao.querySelector('.cartao__titulo').focus();
  if (semMovimento.matches) return;

  const item = cartao.parentElement;
  const metades = criarMetades(cartao, 'metade--volta');
  item.classList.add('costurando');
  item.append(...metades);

  const agulha = criarElemento('span', 'agulha');
  agulha.innerHTML = SVG_AGULHA;
  cartao.append(agulha);
  const [ultimoX] = PONTOS.at(-1);
  agulha.animate([
    { left: `${PONTOS[0][0]}%`, top: '-8%', opacity: 0 },
    ...PONTOS.map(([x, y], i) => ({ left: `${x + 8}%`, top: `${y + 4}%`, opacity: 1, offset: (140 + 110 * i) / 1300, easing: 'cubic-bezier(0.45, 0, 0.2, 1)' })),
    { left: `${ultimoX + 8}%`, top: '110%', opacity: 0 },
  ], { duration: 1300, delay: 440, fill: 'backwards' }).onfinish = () => agulha.remove();
  setTimeout(() => {
    metades.forEach((metade) => metade.remove());
    item.classList.remove('costurando');
  }, 1750);
}

function instalarBilhete(quadro, desfazer) {
  const bilhete = document.querySelector('[data-bilhete]');
  const esconder = () => { bilhete.hidden = true; };

  bilhete.addEventListener('animationend', (evento) => {
    if (evento.animationName === 'pavio') esconder();
  });

  bilhete.querySelector('[data-desfazer]').addEventListener('click', () => {
    esconder();
    const id = desfazer();
    if (id) costurarDeVolta(quadro, id);
  });

  return (texto) => {
    bilhete.hidden = true;
    bilhete.querySelector('[data-bilhete-texto]').textContent = texto;
    void bilhete.offsetWidth;
    bilhete.hidden = false;
    if (semMovimento.matches) setTimeout(esconder, 10000);
  };
}

export function instalarEventosDoQuadro(quadro, dialogo, obterTarefas, { concluir, desfazer }) {
  const mostrarBilhete = instalarBilhete(quadro, desfazer);

  quadro.addEventListener('click', (evento) => {
    if (!(evento.target instanceof Element)) return;
    const botao = evento.target.closest('button[data-acao="ver-detalhes"]');
    if (!botao || !quadro.contains(botao) || quadro.querySelector('.rasgando')) return;
    const cartao = botao.closest('[data-tarefa-id]');
    const tarefa = obterTarefas().find((item) => item.id === cartao?.dataset.tarefaId);
    if (!tarefa) return;
    preencherDetalhes(dialogo, tarefa);
    dialogo.returnValue = '';
    dialogo.showModal();
  });

  dialogo.addEventListener('click', (evento) => {
    if (evento.target === dialogo) dialogo.close();
  });

  dialogo.addEventListener('close', () => {
    if (dialogo.returnValue !== 'concluir') return;
    const id = dialogo.dataset.tarefaId;
    arremessarMachado(quadro, id).then((origem) => {
      concluir(id);
      if (origem) deixarVaga(origem);
      const chegada = quadro.querySelector(`.cartao[data-tarefa-id="${id}"]`);
      if (!chegada) return;
      const item = chegada.parentElement;
      chegada.querySelector('.cartao__titulo').focus();
      mostrarBilhete(`"${chegada.querySelector('.cartao__titulo').textContent}" concluída.`);
      if (!origem) return;

      item.style.opacity = '0';
      voarRolo(origem, item).then(() => {
        item.style.removeProperty('opacity');
        item.style.setProperty('--altura', `${item.offsetHeight}px`);
        item.classList.add('chegou');
        carimbar(item);
      });
    });
  });
}
