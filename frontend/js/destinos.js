function exibirDestinos(destinos) {
  const secao = document.querySelector(".secao");

  const galeriaDestinos = document.createElement("div");
  galeriaDestinos.classList.add("container", "galeria-destinos");

  destinos.forEach((destino) => {
    const cardDestino = document.createElement("article");
    cardDestino.classList.add("card-destino");

    const descricao = destino.descricao === null ? "" : `<p>${destino.descricao}</p>`
    const abrangencia = destino.abrangencia === "internacional" ? "Internacional" : "Nacional";
    const duracao = `${destino.duracao_dias} ${destino.duracao_dias === 1 ? "dia" : "dias"}`;

    cardDestino.innerHTML = `<img src="${destino.imagem_url}" alt="${destino.descricao_alt}" />
                             <div class="card-texto">
                               <ul class="badges-destino">
                                 <li>${abrangencia}</li>
                                 <li>${duracao}</li>
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

  return galeriaDestinos.querySelectorAll(".card-destino")
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

function buscarDestinos(destinos) {
  const inputDestinos = document.getElementById("input-destinos")
  const avisoSemResultados = document.getElementById("sem-resultados");

  inputDestinos.addEventListener("input", () => {
    const termoDeBusca = inputDestinos.value.toLowerCase().trim()

    let destinosEncontrados = 0

    destinos.forEach(destino => {
      const nomeDestino = destino.querySelector("h3").textContent.toLowerCase()

      if (nomeDestino.includes(termoDeBusca)) {
        destino.style.display = "block"
        destinosEncontrados++
      } else {
        destino.style.display = "none"
      }
    })
    
    avisoSemResultados.style.display = destinosEncontrados === 0 ? "block" : "none";
  })
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
      const cards = exibirDestinos(destinos)
      buscarDestinos(cards)
    } else {
      exibirSemDestinos()
    }
  })
  .catch(erro => exibirErro(erro))
  .finally(() => {
    estadoCarregamento.remove();
  });
