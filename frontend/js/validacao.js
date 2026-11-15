const form = document.querySelector("form");
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const erro = document.getElementById("erro");

form.addEventListener("submit", (e) => {
  erro.textContent = "";
  const valor = senha.value;

  if (nome && nome.value.trim() === "") {
    erro.textContent = "Digite seu nome.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    erro.textContent = "Digite um e-mail válido.";
  } else if (valor.length < 8) {
    erro.textContent = "A senha deve ter no mínimo 8 caracteres.";
  } else if (!/[a-z]/.test(valor)) {
    erro.textContent = "Inclua ao menos uma letra minúscula.";
  } else if (!/[A-Z]/.test(valor)) {
    erro.textContent = "Inclua ao menos uma letra maiúscula.";
  } else if (!/\d/.test(valor)) {
    erro.textContent = "Inclua ao menos um número.";
  }

  if (erro.textContent !== "") {
    e.preventDefault();
  }
});