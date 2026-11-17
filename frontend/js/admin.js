const token = localStorage.getItem("token");
const ehAdmin = localStorage.getItem("admin") === "true";
const formDestino = document.getElementById("form-destino");
const modalDestino = document.getElementById("modal-destino");

if (ehAdmin) {
  document.getElementById("admin").style.display = "block";
}

async function enviar(caminho, metodo, corpo) {
  const resposta = await fetch("http://localhost:3000/api/destinos" + caminho, {
    method: metodo,
    headers: {"Content-Type": "application/json", Authorization: "Bearer " + token},
    body: JSON.stringify(corpo)
  });

  if (resposta.ok) {
    location.reload();
  } else {
    alert((await resposta.json()).mensagem);
  }
}

function abrirFormulario(destino) {
  formDestino.reset();
  document.getElementById("titulo-modal").textContent = destino ? "Editar destino" : "Novo destino";
  modalDestino.showModal();

  for (const campo in destino) {
    if (formDestino.elements[campo]) {
      formDestino.elements[campo].value = destino[campo] ?? "";
    }
  }
}

function desativarDestino(id) {
  enviar("/" + id, "DELETE");
}

formDestino.addEventListener("submit", (e) => {
  e.preventDefault();
  const dados = Object.fromEntries(new FormData(formDestino));

  if (dados.id) {
    enviar("/" + dados.id, "PUT", dados);
  } else {
    enviar("", "POST", dados);
  }
});
