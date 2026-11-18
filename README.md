# AirFly

## Problema / Objetivo

O site resolve a dificuldade de descobrir e comparar pacotes de viagem de forma rápida, organizada e visualmente atraente, com centralização das informações. Objetivo: apresentar a agência, exibir destinos/pacotes disponíveis e permitir que o visitante solicite um orçamento ou reserva pelo formulário.

## Público-alvo

Pessoas de 25 a 55 anos que estão planejando viagens de lazer e buscam praticidade para pesquisar destinos, comparar opções e entrar em contato.
Considerações de acessibilidade: navegação simples, textos claros, contraste adequado (público não necessariamente familiarizado com tecnologia).

## Proposta

O usuário poderá:

- Conhecer a agência (missão, diferenciais, forma de atendimento);
- Consultar destinos/pacotes organizados em cards (com imagem, nome do destino, preço estimado, duração);
- Fazer buscas simples (ex: nacional/internacional);
- Preencher um formulário de reserva com dados pessoais, destino desejado, data e número de viajantes.

## Arquitetura

| Página/Arquivo  | Conteúdo                                                                                              |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| `index.html`    | Apresentação da agência, destaques (3 pacotes em cards)                                               |
| `sobre.html`    | Missão, diferenciais, história, equipe                                                                |
| `destinos.html` | Catálogo completo de pacotes em Grid, com opções de busca                                             |
| `contato.html`  | Formulário de reserva + informações de contato                                                        |
| `css/style.css` | Variáveis `:root`, reset, tipografia, componentes base (botões, cards, navbar, footer), media queries |
| `login.html`    | Página de Login                                                                                       |
| `cadastro.html` | Página de Cadastro                                                                                    |
| `login.js`      | Backend para Login                                                                                    |
| `cadastro.js`   | Backend para Cadastro                                                                                 |
| `contato.js`    | Backend para Contato - o envio do formulário                                                          |
| `destinos.js`   | Backend para encontrar os destinos                                                                    |
| `validacao.js`  | Backend para validações                                                                               |
| `admin.js`      | Backend para a parte de administrador                                                                 |

## Como executar

### 1. Banco no Neon

No SQL Editor do Neon, execute o conteúdo de `ddl.sql` uma vez. Isso cria:

- `usuarios` (campo `admin` começa em `FALSE`)
- `destinos` (já com os pacotes de exemplo, `ativo = TRUE`)
- `solicitacoes` (orçamentos do formulário de contato)

### 2. Variáveis de ambiente

Na pasta `backend`, crie o arquivo `.env`:

```env
DATABASE_URL=postgresql://USUARIO:SENHA@HOST-pooler.REGIAO.aws.neon.tech/neondb?sslmode=require
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
```

- `DATABASE_URL`: connection string do Neon (Dashboard → Connect).
- `PORT`: porta do Express. Se omitir, o servidor usa `3000`.
- `JWT_SECRET`: chave secreta para validar os tokens JWT durante a autenticação dos usuários.

### 3. Instalar e iniciar

No terminal, a partir da raiz do projeto:

```bash
cd backend
npm install
npm run dev
```

`npm run dev` sobe o servidor com nodemon (`backend/src/server.js`) e recarrega ao salvar. Para subir sem recarga automática:

```bash
npm start
```

Quando der certo, o terminal mostra `Servidor rodando na porta 3000`.

### 4. Frontend

Sirva a pasta `frontend/` (por exemplo com a extensão Live Server) e abra `index.html`. As páginas chamam `http://localhost:3000`.

### 5. Virar administrador

Nos planejamos criar o CRUD dos destinos de viagem entretanto para evitar que o usuario comum fizesse isso foi criado um usuario admin que pode acessar e realizar todas essas ações.

Deste modo primeiro voce deve cadastrar um usuario comum e depois ir no banco de dados e promovelo para admin, assim tendo acesso a todas as rotas do criadas

O cadastro pela tela ou por `POST /api/usuarios` cria usuário comum. No SQL Editor do Neon:

```sql
UPDATE usuarios SET admin = TRUE WHERE email = 'seu-email@exemplo.com';
```

Faça login de novo. A resposta traz `token` e `admin: true`. O frontend guarda os dois no `localStorage` e libera o painel em `destinos.html`. Nas rotas de admin, envie:

```http
Authorization: Bearer SEU_TOKEN
```

## O token vale 1 dia.

# Rotas da API

Base: `http://localhost:3000`
| Método | Rota | Quem pode | O que faz |
|---|---|---|---|
| POST | `/api/login` | Público | Autentica e devolve `{ token, admin }` |
| POST | `/api/usuarios` | Público | Cria usuário (sempre não admin) |
| PUT | `/api/usuarios/:id` | Público | Atualiza nome, email e senha |
| DELETE | `/api/usuarios/:id` | Público | Apaga o usuário |
| GET | `/api/destinos` | Público | Lista destinos ativos |
| POST | `/api/destinos` | Admin | Cria destino |
| PUT | `/api/destinos/:id` | Admin | Atualiza destino ativo |
| DELETE | `/api/destinos/:id` | Admin | Desativa o destino (`ativo = FALSE`) |
| POST | `/api/solicitacoes` | Público | Grava pedido de orçamento/reserva |

## Login — público

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"cliente@exemplo.com\",\"senha\":\"SenhaForte123\"}"
```

Corpo: `email`, `senha`. Sucesso: `{ "token": "...", "admin": false }` ou `false`.

## Usuários — públicos

Criar:

```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"nomeExemplo\",\"email\":\"cliente@exemplo.com\",\"senha\":\"SenhaForte123\"}"
```

Corpo: `nome`, `email`, `senha`. A senha é gravada com salt + scrypt. Email repetido devolve `409`.
Atualizar (envia os três campos de novo):

```bash
curl -X PUT http://localhost:3000/api/usuarios/1 \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"nomeExemplo\",\"email\":\"cliente@exemplo.com\",\"senha\":\"SenhaForte123\"}"
```

Apagar:

```bash
curl -X DELETE http://localhost:3000/api/usuarios/1
```

## Destinos

Listar (público). Só entram registros com `ativo = true`:

```bash
curl http://localhost:3000/api/destinos
```

Criar (admin):

```bash
curl -X POST http://localhost:3000/api/destinos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d "{\"nome_destino\":\"nomeExemplo\",\"abrangencia\":\"nacional\",\"descricao\":\"descricaoExemplo\",\"preco_inicial\":200,\"duracao_dias\":3,\"imagem_url\":\"exemplo\",\"descricao_alt\":\"Praia\"}"
```

`abrangencia` aceita só `nacional` ou `internacional`. `preco_inicial` e `duracao_dias` precisam ser maiores que zero.
Atualizar (admin):

```bash
curl -X PUT http://localhost:3000/api/destinos/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d "{\"nome_destino\":\"nomeExemplo\",\"abrangencia\":\"internacional\",\"descricao\":\"descricaoExemplo\",\"preco_inicial\":200,\"duracao_dias\":3,\"imagem_url\":\"exemplo\",\"descricao_alt\":\"Praia\"}"
```

Desativar (admin). A linha permanece no banco e some da listagem:

```bash
curl -X DELETE http://localhost:3000/api/destinos/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Solicitações — público

Usada pelo formulário de `contato.html`. `destino` é o `id` numérico de um destino.

```bash
curl -X POST http://localhost:3000/api/solicitacoes \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Ana\",\"email\":\"ana@exemplo.com\",\"viajantes\":2,\"data_viagem\":\"2026-12-20\",\"destino\":1,\"observacoes\":\"Quarto duplo\"}"
```

Obrigatórios: `nome`, `email`, `viajantes`, `data_viagem`, `destino`. `observacoes` pode ir vazio.
