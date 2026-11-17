function exibirDestinos(destinos) {
  const secao = document.querySelector(".secao");

  const galeriaDestinos = document.createElement("div");
  galeriaDestinos.classList.add("container", "galeria-destinos");

  destinos.forEach((destino) => {
    const cardDestino = document.createElement("article");
    cardDestino.classList.add("card-destino");

    const descricao = destino.descricao === null ? "" : `<p>${destino.descricao}</p>`;
    const abrangencia = destino.abrangencia === "internacional" ? "Internacional" : "Nacional";
    const duracao = `${destino.duracao_dias} ${destino.duracao_dias === 1 ? "dia" : "dias"}`;

    cardDestino.innerHTML = `<img src="${destino.imagem_url}" alt="${destino.descricao_alt}" />
                             <div class="card-texto">
                               <ul class="badges-destino">
                                 <li class="abrangencia">${abrangencia}</li>
                                 <li class="duracao">${duracao}</li>
                               </ul>
                               <h3>${destino.nome_destino}</h3>
                               ${descricao}
                               <p class="preco">A partir de R$ ${destino.preco_inicial}</p>
                               <a class="botao secundario" href="contato.html">Saiba mais</a>
                             </div>`;

    if (ehAdmin) {
      const acoes = document.createElement("div");
      acoes.classList.add("acoes-admin");
      acoes.innerHTML = `<button class="botao pequeno secundario">Editar</button>
                         <button class="botao pequeno perigo">Desativar</button>`;
      acoes.children[0].onclick = () => abrirFormulario(destino);
      acoes.children[1].onclick = () => desativarDestino(destino.id);

      cardDestino.querySelector(".card-texto").append(acoes);
    }

    galeriaDestinos.appendChild(cardDestino);
  });
  secao.appendChild(galeriaDestinos);

  return galeriaDestinos.querySelectorAll(".card-destino");
}

function exibirSemDestinos() {
  const secao = document.querySelector(".secao");
  secao.innerHTML = `<p class="aviso-sem-destinos">Não há destinos disponíveis no momento.</p>`;
}

function exibirErro(erro) {
  const secao = document.querySelector(".secao");
  console.error(erro);
  secao.innerHTML = `<p class="mensagem-erro">Ocorreu um erro ao carregar os destinos. Tente novamente mais tarde.</p>`;
}

const estadoCarregamento = document.getElementById("carregando-destinos");

function aplicarFiltro(destinos, busca, abrangencia, duracao) {
  const avisoSemResultados = document.getElementById("sem-resultados");

  let destinosEncontrados = 0;

  destinos.forEach(destino => {
    const nomeDestino = destino.querySelector("h3").textContent.toLowerCase();
    const abrangenciaDestino = destino.querySelector(".abrangencia").textContent;
    const duracaoDestino = destino.querySelector(".duracao").textContent;

    if (nomeDestino.includes(busca) && abrangenciaDestino.includes(abrangencia) && duracaoDestino.includes(duracao)) {
      destino.style.display = "block";
      destinosEncontrados++;
    } else {
      destino.style.display = "none";
    }
  });
  avisoSemResultados.style.display = destinosEncontrados === 0 ? "block" : "none";
}

function filtrarDestinos(destinos) {
  const inputDestinos = document.getElementById("input-destinos");
  const filtroAbrangencia = document.getElementById("filtro-abrangencia");
  const filtroDuracao = document.getElementById("filtro-duracao");

  let busca = inputDestinos.value;
  let abrangencia = filtroAbrangencia.value;
  let duracao = filtroDuracao.value;

  inputDestinos.addEventListener("input", () => {
    busca = inputDestinos.value.toLowerCase().trim();
    aplicarFiltro(destinos, busca, abrangencia, duracao);
  });
  filtroAbrangencia.addEventListener("change", () => {
    abrangencia = filtroAbrangencia.value;
    aplicarFiltro(destinos, busca, abrangencia, duracao);
  });
  filtroDuracao.addEventListener("input", () => {
    duracao = filtroDuracao.value;
    aplicarFiltro(destinos, busca, abrangencia, duracao);
  });
}

fetch("http://localhost:3000/api/destinos")
  .then(resposta => {
    if (!resposta.ok) {
      throw new Error(`Falha ao carregar destinos: ${resposta.status}`);
    }
    return resposta.json();
  })
  .then(destinos => {
    if (destinos.length > 0) {
      const cards = exibirDestinos(destinos);
      filtrarDestinos(cards);
    } else {
      exibirSemDestinos();
    }
  })
  .catch(erro => exibirErro(erro))
  .finally(() => estadoCarregamento.remove());
