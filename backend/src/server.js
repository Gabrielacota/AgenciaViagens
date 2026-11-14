require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/destinos", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT NOW()");

    res.json({
      mensagem: "Conexão realizada",
    });
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      erro: "Erro ao conectar com o banco.",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
