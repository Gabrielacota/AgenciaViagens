const formulario = document.getElementById("form-contato");

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const dados = {
    nome: formulario.elements.nome.value.trim(),
    email: formulario.elements.email.value.trim(),
    viajantes: Number(formulario.elements.viajantes.value),
    data_viagem: formulario.elements.dataViagem.value,
    destino: Number(formulario.elements.destino.value),
    observacoes: formulario.elements.observacoes.value,
  };
  try {
    const resposta = await fetch("http://localhost:3000/api/solicitacoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(dados),
    });
    const resultado = await resposta.json();
    if (!resposta.ok) {
      throw new Error(resultado.mensagem);
    }
    alert(resultado.mensagem);

    formulario.reset();
  } catch (erro) {
    console.error("Erro:", erro);

    alert(erro.mensagem || "Não foi possível enviar.");
    
  }
});
