const formulario = document.querySelector("form");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoSenha = document.getElementById("senha");
const mensagemErro = document.getElementById("erro");

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mensagemErro.textContent = "";

  const nome = campoNome.value.trim();
  const email = campoEmail.value.trim();
  const senha = campoSenha.value;

  if (!nome) {
    mensagemErro.textContent = "Digite seu nome.";
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    mensagemErro.textContent = "Digite um e-mail válido.";
    return;
  }

  if (senha.length < 8) {
    mensagemErro.textContent = "A senha deve ter no mínimo 8 caracteres.";
    return;
  }

  if (!/[a-z]/.test(senha)) {
    mensagemErro.textContent = "Inclua ao menos uma letra minúscula.";
    return;
  }

  if (!/[A-Z]/.test(senha)) {
    mensagemErro.textContent = "Inclua ao menos uma letra maiúscula.";
    return;
  }

  if (!/\d/.test(senha)) {
    mensagemErro.textContent = "Inclua ao menos um número.";
    return;
  }

  const botao = formulario.querySelector('button[type="submit"]');
  botao.disabled = true;

  try {
    const resposta = await fetch("http://localhost:3000/api/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, email, senha }),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.mensagem || "Não foi possível realizar o cadastro.");
    }

    alert(resultado.mensagem);
    formulario.reset();
  } catch (erro) {
    mensagemErro.textContent =
      erro.message || "Não foi possível conectar ao servidor.";
  } finally {
    botao.disabled = false;
  }
});