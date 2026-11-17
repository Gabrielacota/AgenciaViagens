require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { randomBytes, scryptSync } = require("node:crypto");
const jwt = require("jsonwebtoken");
const pool = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());

function autenticar(req, res, next) {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (erro) {
    res.status(401).json({mensagem: "Faça login."});
  }
}

function soAdmin(req, res, next) {
  if (!req.usuario.admin) {
    return res.status(403).json({mensagem: "Apenas admin."});
  }

  next();
}

app.post("/api/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({mensagem: "Informe email e senha."});
  }

  try {
    const resultado = await pool.query("SELECT id, senha, admin FROM usuarios WHERE email = $1", [email]);
    const usuario = resultado.rows[0];

    if (usuario) {
      const [salt, hash] = usuario.senha.split(":");
      const hashInformado = scryptSync(senha, salt, 64).toString("hex");

      if (hashInformado === hash) {
        const token = jwt.sign({id: usuario.id, admin: usuario.admin}, process.env.JWT_SECRET, {expiresIn: "1d"});
        return res.json({token});
      }
    }

    return res.status(401).json({mensagem: "Email ou senha incorretos."});
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({mensagem: "Erro ao fazer login."});
  }
});

app.post("/api/usuarios", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({mensagem: "Informe nome, email e senha."});
  }

  try {
    const salt = randomBytes(16).toString("hex");
    const senhaProtegida = `${salt}:${scryptSync(senha, salt, 64).toString("hex")}`;

    const resultado = await pool.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id",
      [nome, email, senhaProtegida]
    );

    return res.status(201).json({
      mensagem: "Usuario criado com sucesso",
      id: resultado.rows[0].id
    });
  } catch (erro) {
    if (erro.code === "23505") {
      return res.status(409).json({mensagem: "Ja existe um usuario com esse email."});
    }

    console.error(erro);
    return res.status(500).json({mensagem: "Não foi possivel criar o usuario."});
  }
});

app.put("/api/usuarios/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nome, email, senha } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({mensagem: "ID incorreto."});
  }

  if (!nome || !email || !senha) {
    return res.status(400).json({mensagem: "Informe nome, email e senha."});
  }

  try {
    const salt = randomBytes(16).toString("hex");
    const senhaProtegida = `${salt}:${scryptSync(senha, salt, 64).toString("hex")}`;

    const resultado = await pool.query(
      "UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4",
      [nome, email, senhaProtegida, id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({mensagem: "Usuario não encontrado."});
    }

    return res.json({mensagem: "Usuario atualizado com sucesso."});
  } catch (erro) {
    if (erro.code === "23505") {
      return res.status(409).json({mensagem: "Ja existe um usuario com esse email."});
    }

    console.error(erro);
    return res.status(500).json({mensagem: "Erro ao atualizar o usuario."});
  }
});

app.delete("/api/usuarios/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({mensagem: "ID incorreto."});
  }

  try {
    const resultado = await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({mensagem: "Usuario não encontrado."});      
    }

    return res.json({mensagem: "Usuario deletado com sucesso."});
  }catch (erro) {
    console.error(erro);
    return res.status(500).json({mensagem: "Erro ao deletar o usuario."});
  }
});

app.get("/api/destinos", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT id, nome_destino, abrangencia, descricao, preco_inicial, duracao_dias, imagem_url, descricao_alt FROM destinos WHERE ativo = TRUE ORDER BY id");
    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      erro: "Erro ao conectar com o banco.",
    });
  }
});

app.post("/api/destinos", autenticar, soAdmin, async (req, res) => {
  const { nome_destino, abrangencia, descricao, preco_inicial, duracao_dias, imagem_url, descricao_alt } = req.body;

  try {
    const resultado = await pool.query(
      "INSERT INTO destinos (nome_destino, abrangencia, descricao, preco_inicial, duracao_dias, imagem_url, descricao_alt) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [nome_destino, abrangencia, descricao, preco_inicial, duracao_dias, imagem_url, descricao_alt]
    );

    return res.status(201).json({mensagem: "Destino criado com sucesso", id: resultado.rows[0].id});
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({mensagem: "Erro ao criar o destino."});
  }
});

app.put("/api/destinos/:id", autenticar, soAdmin, async (req, res) => {
  const { nome_destino, abrangencia, descricao, preco_inicial, duracao_dias, imagem_url, descricao_alt } = req.body;

  try {
    const resultado = await pool.query(
      "UPDATE destinos SET nome_destino = $1, abrangencia = $2, descricao = $3, preco_inicial = $4, duracao_dias = $5, imagem_url = $6, descricao_alt = $7 WHERE id = $8 AND ativo = TRUE",
      [nome_destino, abrangencia, descricao, preco_inicial, duracao_dias, imagem_url, descricao_alt, req.params.id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({mensagem: "Destino nao encontrado."});
    }

    return res.json({mensagem: "Destino atualizado com sucesso."});
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({mensagem: "Erro ao atualizar o destino."});
  }
});

app.delete("/api/destinos/:id", autenticar, soAdmin, async (req, res) => {
  try {
    const resultado = await pool.query("UPDATE destinos SET ativo = FALSE WHERE id = $1 AND ativo = TRUE", [req.params.id]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({mensagem: "Destino nao encontrado."});
    }

    return res.json({mensagem: "Destino desativado com sucesso."});
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({mensagem: "Erro ao desativar o destino."});
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
