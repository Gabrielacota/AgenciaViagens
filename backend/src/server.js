require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { randomBytes, scryptSync } = require("node:crypto");
const pool = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/usuarios", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: "Informe nome, email e senha." });
  }

  try {
    const salt = randomBytes(16).toString("hex");
    const senhaProtegida = `${salt}:${scryptSync(senha, salt, 64).toString("hex")}`;

    const resultado = await pool.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id",
      [nome, email, senhaProtegida],
    );

    return res.status(201).json({
      mensagem: "Usuario criado com sucesso",
      id: resultado.rows[0].id,
    });
  } catch (erro) {
    if (erro.code === "23505") {
      return res
        .status(409)
        .json({ mensagem: "Ja existe um usuario com esse email." });
    }

    console.error(erro);
    return res
      .status(500)
      .json({ mensagem: "Não foi possivel criar o usuario." });
  }
});

app.put("/api/usuarios/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nome, email, senha } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ mensagem: "ID incorreto." });
  }

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: "Informe nome, email e senha." });
  }

  try {
    const salt = randomBytes(16).toString("hex");
    const senhaProtegida = `${salt}:${scryptSync(senha, salt, 64).toString("hex")}`;

    const resultado = await pool.query(
      "UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4",
      [nome, email, senhaProtegida, id],
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensagem: "Usuario não encontrado." });
    }

    return res.json({ mensagem: "Usuario atualizado com sucesso." });
  } catch (erro) {
    if (erro.code === "23505") {
      return res
        .status(409)
        .json({ mensagem: "Ja existe um usuario com esse email." });
    }

    console.error(erro);
    return res.status(500).json({ mensagem: "Erro ao atualizar o usuario." });
  }
});

app.delete("/api/usuarios/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ mensagem: "ID incorreto." });
  }

  try {
    const resultado = await pool.query("DELETE FROM usuarios WHERE id = $1", [
      id,
    ]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensagem: "Usuario não encontrado." });
    }

    return res.json({ mensagem: "Usuario deletado com sucesso." });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: "Erro ao deletar o usuario." });
  }
});

app.get("/api/destinos", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT id, nome_destino, abrangencia, descricao, preco_inicial, duracao_dias, imagem_url, descricao_alt FROM destinos WHERE ativo = TRUE ORDER BY id",
    );
    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      erro: "Erro ao conectar com o banco.",
    });
  }
});

app.post("/api/solicitacoes", async (req, res) => {
  const { nome, email, viajantes, data_viagem, destino, observacoes } =
    req.body;
  if (!nome || !email || !viajantes || !data_viagem || !destino) {
    return res.status(400).json({
      mensagem: "Preencha todos os campos",
    });
  }
  // O usuário não pode ter a opção de escolher destinos inativos
  try {
    const resultado = await pool.query(
      `INSERT INTO solicitacoes
        (destino_id, nome_cliente, email, num_viajantes,
         data_viagem, observacoes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [destino, nome, email, viajantes, data_viagem, observacoes],
    );

    return res.status(201).json({
      mensagem: "Solicitação enviada com sucesso!",
      id: resultado.rows[0].id,
    });
  } catch (erro) {
    console.error("Erro ao cadastrar solicitação:", erro);

    return res.status(500).json({
      mensagem: "Não foi possível enviar sua solicitação.",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
