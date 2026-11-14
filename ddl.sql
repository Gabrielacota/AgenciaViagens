CREATE TABLE destinos (
    id            SERIAL PRIMARY KEY,
    nome_destino  VARCHAR(100) NOT NULL,
    abrangencia   VARCHAR(15) NOT NULL
                  CHECK (abrangencia IN ('nacional', 'internacional')),
    descricao     TEXT,
    preco_inicial NUMERIC(10,2) NOT NULL
                  CHECK (preco_inicial > 0),
    duracao_dias  INTEGER NOT NULL
                  CHECK (duracao_dias > 0),
    imagem_url    VARCHAR(200),
    descricao_alt VARCHAR(200) NOT NULL,
    ativo         BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em     TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT nome_unico_destino UNIQUE (nome_destino)
);

CREATE TABLE solicitacoes (
    id            SERIAL PRIMARY KEY,
    destino_id    INTEGER NOT NULL
                  REFERENCES destinos(id) ON DELETE RESTRICT,
    nome_cliente  VARCHAR(120) NOT NULL,
    email         VARCHAR(150) NOT NULL,
    num_viajantes INTEGER NOT NULL
                  CHECK (num_viajantes >= 1),
    data_viagem   DATE NOT NULL,
    observacoes   TEXT,
    criado_em     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE servicos (
    id   SERIAL PRIMARY KEY,
    nome VARCHAR(30) NOT NULL UNIQUE
);

INSERT INTO servicos (nome) VALUES
('Hotel'),
('Transporte'),
('Guia');

CREATE TABLE solicitacao_servicos (
    solicitacao_id INTEGER NOT NULL
        REFERENCES solicitacoes(id) ON DELETE CASCADE,

    servico_id INTEGER NOT NULL
        REFERENCES servicos(id) ON DELETE RESTRICT,

    PRIMARY KEY (solicitacao_id, servico_id)
);

INSERT INTO destinos (
    nome_destino,
    abrangencia,
    descricao,
    preco_inicial,
    duracao_dias,
    imagem_url,
    descricao_alt
) VALUES
(
    'Maragogi, Alagoas',
    'nacional',
    'Cinco dias no litoral alagoano, com passeio de catamarã pelas piscinas naturais.',
    2480.00,
    5,
    'images/maragogi.png',
    'Praia de Maragogi'
),
(
    'Chapada Diamantina, Bahia',
    'nacional',
    'Seis dias de trilhas guiadas até cachoeiras e mirantes, com hospedagem em Lençóis.',
    2960.00,
    6,
    'images/chapada-diamantina.jpg',
    'Lago da cachoeira da chapada diamantina'
),
(
    'Lisboa, Portugal',
    'internacional',
    'Oito dias entre bairros históricos e bondinhos, com hotel na Baixa e city tour.',
    8420.00,
    8,
    'images/lisboa.jpeg',
    'Bonde no vilarejo de Lisboa'
),
(
    'Orlando, EUA',
    'internacional',
    NULL,
    5400.00,
    2,
    'images/disney.jpg',
    'Castelo da Disney, Orlando'
),

    'Zermatt, Suíça',
    'internacional',
    NULL,
    4700.00,
    3,
    'images/zermatt.jpg',
    'Esqui na neve, Zermatt'
),
(
    'Cairo, Egito',
    'internacional',
    NULL,
    3900.00,
    3,
    'images/cairo.png',
    'Prédio rosa do apartamento, Cairo'
),
(
    'Recife, Brasil',
    'nacional',
    NULL,
    770.00,
    4,
    'images/boa-viagem.jpg',
    'Praia de Boa Viagem, Recife'
),
(
    'Autódromo de Interlagos, São Paulo',
    'nacional',
    NULL,
    270.00,
    1,
    'images/lollapalooza.jpg',
    'Lollapalooza, Interlagos'
),
(
    'Paris, França',
    'internacional',
    NULL,
    2400.00,
    1,
    'images/paris.jpg',
    'Torre Eiffel e sakura, Paris'
);
