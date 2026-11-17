CREATE TABLE usuarios (
    id        SERIAL PRIMARY KEY,
    nome      VARCHAR(100) NOT NULL,
    email     VARCHAR(150) NOT NULL UNIQUE,
    senha     TEXT NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE destinos (
    id            SERIAL PRIMARY KEY,
    nome_destino  VARCHAR(100) NOT NULL,
    descricao     TEXT,
    preco_inicial NUMERIC(10,2) NOT NULL
                  CHECK (preco_inicial > 0),
    duracao_dias  INTEGER NOT NULL
                  CHECK (duracao_dias > 0),
    imagem_url    TEXT,
    descricao_alt VARCHAR(50) NOT NULL,
    ativo         BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE solicitacoes (
    id            SERIAL PRIMARY KEY,
    destino_id    INTEGER NOT NULL
                  REFERENCES destinos(id) ON DELETE RESTRICT,
    nome_cliente  VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL,
    num_viajantes INTEGER NOT NULL
                  CHECK (num_viajantes BETWEEN 1 AND 20),
    data_viagem   DATE NOT NULL,
    observacoes   TEXT,
    criado_em     TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO destinos (
    nome_destino,
    descricao,
    preco_inicial,
    duracao_dias,
    imagem_url,
    descricao_alt
) VALUES
(
    'Maragogi, Alagoas',
    'Cinco dias no litoral alagoano, com passeio de catamarã pelas piscinas naturais.',
    2480.00,
    5,
    'images/maragogi.png',
    'Praia de Maragogi'
),
(
    'Chapada Diamantina, Bahia',
    'Seis dias de trilhas guiadas até cachoeiras e mirantes, com hospedagem em Lençóis.',
    2960.00,
    6,
    'images/chapada-diamantina.jpg',
    'Lago da cachoeira da chapada diamantina'
),
(
    'Lisboa, Portugal',
    'Oito dias entre bairros históricos e bondinhos, com hotel na Baixa e city tour.',
    8420.00,
    8,
    'images/lisboa.jpeg',
    'Bonde no vilarejo de Lisboa'
),
(
    'Orlando, EUA',
    NULL,
    5400.00,
    2,
    'images/disney.jpg',
    'Castelo da Disney, Orlando'
),
(
    'Zermatt, Suíça',
    NULL,
    4700.00,
    3,
    'images/zermatt.jpg',
    'Esqui na neve, Zermatt'
),
(
    'Cairo, Egito',
    NULL,
    3900.00,
    3,
    'images/cairo.png',
    'Prédio rosa do apartamento, Cairo'
),
(
    'Recife, Brasil',
    NULL,
    770.00,
    4,
    'images/boa-viagem.jpg',
    'Praia de Boa Viagem, Recife'
),
(
    'Autódromo de Interlagos, São Paulo',
    NULL,
    270.00,
    1,
    'images/lollapalooza.jpg',
    'Lollapalooza, Interlagos'
),
(
    'Paris, França',
    NULL,
    2400.00,
    1,
    'images/paris.jpg',
    'Torre Eiffel e sakura, Paris'
);
