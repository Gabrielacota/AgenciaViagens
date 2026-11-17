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
- Selecionar filtros simples (ex: nacional/internacional, praia/aventura/cultural);
- Preencher um formulário de orçamento/reserva com dados pessoais, destino desejado, datas e número de viajantes.

## Arquitetura

| Página/Arquivo | Conteúdo |
|---|---|
| `index.html` | Hero, apresentação da agência, chamada principal, destaques (3-4 pacotes em cards) |
| `sobre.html` | Missão, diferenciais, história, equipe |
| `destinos.html` | Catálogo completo de pacotes em Grid, com categorias/seções (nacional, internacional, praia, aventura) |
| `contato.html` | Formulário de orçamento/reserva completo + informações de contato |
| `css/style.css` | Variáveis `:root`, reset, tipografia, componentes base (botões, cards, navbar, footer), media queries |

## Como executar

### 1. Configurar e iniciar o backend

No terminal, execute:

```bash
cd backend
npm install
npm run dev
```

O servidor inicia na porta `3000` por padrão.

### 2. Abrir o frontend

Sirva a pasta `frontend/` com uma extensão como Live Server e abra `index.html`.

### Rota

Listar todos destinos (get):

```bash
curl http://localhost:3000/api/destinos
```

Criar Destino (post):

```bash
curl -X POST http://localhost:3000/api/destinos
    -H "Content-Type: application/json" \
    -d '{"nome_destino":"nomeExemplo","abrangencia":"abrangenciaExemplo","descricao":"descricaoExemplo","preco_inicial":"200", "duracao_dias":"3","imagem_url":"exemplo","descricao_alt":"122.44"}'
```

Atualizar Destino (put):

```bash
curl -X PUT http://localhost:3000/api/destinos/:id
    -H "Content-Type: application/json" \
    -d '{"nome_destino":"nomeExemplo","abrangencia":"abrangenciaExemplo","descricao":"descricaoExemplo","preco_inicial":"200", "duracao_dias":"3","imagem_url":"exemplo","descricao_alt":"122.44"}'
```

Deletar Destino (delete):

```bash
curl http://localhost:3000/api/destinos/:id
```

Fazer login:

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"cliente@exemplo.com","senha":"SenhaForte123"}'
```

Criar Usuario (post):

```bash
curl -X POST http://localhost:3000/api/usuarios
    -H "Content-Type: application/json" \
    -d '{"nome":"nomeExemplo", "email":"cliente@exemplo.com","senha":"SenhaForte123"}'
```

Atualizar Usuario (put):

```bash
curl -X PUT http://localhost:3000/api/usuarios/:id
    -H "Content-Type: application/json" \
    -d '{"nome":"nomeExemplo", "email":"cliente@exemplo.com","senha":"SenhaForte123"}'
```

Deletar Usuario (delete):

```bash
curl http://localhost:3000/api/usuarios/:id
```