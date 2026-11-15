function exibirDestinos(destinos) {
  const secao = document.querySelector(".secao");

  const galeriaDestinos = document.createElement("div");
  galeriaDestinos.classList.add("container", "galeria-destinos");

  destinos.forEach((destino) => {
    const cardDestino = document.createElement("article");
    cardDestino.classList.add("card-destino");

    let descricaoDestino = `<p>${destino.descricao}</p>`;
    if (destino.descricao === null) {
      descricaoDestino = "";
    }

    cardDestino.innerHTML = `<img src="${destino.imagem_url}" alt="${destino.descricao_alt}" /><div class="card-texto"><h3>${destino.nome_destino}</h3>${descricaoDestino}<p class="preco">A partir de R$ ${destino.preco_inicial}</p><a class="botao secundario" href="contato.html">Saiba mais</a></div>`;

    galeriaDestinos.appendChild(cardDestino);
  });
  secao.appendChild(galeriaDestinos);
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

fetch("http://localhost:3000/api/destinos")
  .then(resposta => {
    if (!resposta.ok) {
      throw new Error(`Falha ao carregar destinos: ${resposta.status}`);
    }
    return resposta.json();
  })
  .then(destinos => {
    if (destinos.length > 0) {
      exibirDestinos(destinos)
    } else {
      exibirSemDestinos()
    }
  })
  .catch(erro => exibirErro(erro));
