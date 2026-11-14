const galeriaDestinos = document.querySelector(".galeria-destinos");

fetch("http://localhost:3000/api/destinos")
  .then(resposta => {
    if (!resposta.ok) {
      throw new Error(`Falha ao carregar destinos: HTTP ${resposta.status}`);
    }

    return resposta.json();
  })
  .then(destinos =>
    destinos.forEach((destino) => {
      const cardDestino = document.createElement("article");
      cardDestino.classList.add("card-destino");
      cardDestino.innerHTML = `<img src="${destino.imagem_url}" alt="Praia de Maragogi" /><div class="card-texto"><h3>${destino.nome_destino}</h3><p>${destino.descricao}</p><p class="preco">A partir de R$ ${destino.preco_inicial}</p><a class="botao secundario" href="contato.html">Saiba mais</a></div>`;
      galeriaDestinos.appendChild(cardDestino);
    }),
  )
  .catch(erro => {
    console.error(erro);
    galeriaDestinos.innerHTML = "<p>Ocorreu um erro ao carregar os destinos.</p>";
  });
