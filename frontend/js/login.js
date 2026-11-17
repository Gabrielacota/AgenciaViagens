form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (erro.textContent !== "") return;

  const resposta = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({email: email.value, senha: senha.value})
  });
  const dados = await resposta.json();

  if (!resposta.ok) {
    erro.textContent = dados.mensagem;
    return;
  }

  localStorage.setItem("token", dados.token);
  localStorage.setItem("admin", dados.admin);
  location.href = "destinos.html";
});
