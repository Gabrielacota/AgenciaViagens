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
