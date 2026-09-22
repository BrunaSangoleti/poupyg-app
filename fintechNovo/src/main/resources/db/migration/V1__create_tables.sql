CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE T_USUARIO (
    id_usuario UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nm_usuario VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    cpf_usuario VARCHAR(15) NOT NULL UNIQUE,
    telefone VARCHAR(15) NOT NULL
);

CREATE TABLE T_DESPESA (
    id_despesa UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ds_despesa VARCHAR(255),
    vl_despesa DECIMAL(19, 2),
    id_usuario UUID NOT NULL,
    CONSTRAINT fk_despesa_usuario FOREIGN KEY (id_usuario) REFERENCES T_USUARIO (id_usuario) ON DELETE CASCADE
);

CREATE TABLE T_RECEITA (
    id_receita UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ds_receita VARCHAR(255),
    vl_receita DECIMAL(19, 2),
    id_usuario UUID NOT NULL,
    CONSTRAINT fk_receita_usuario FOREIGN KEY (id_usuario) REFERENCES T_USUARIO (id_usuario) ON DELETE CASCADE
);

CREATE TABLE T_INVESTIMENTO (
    id_investimento UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ds_investimento VARCHAR(255),
    vl_investimento DECIMAL(19, 2),
    id_usuario UUID NOT NULL,
    CONSTRAINT fk_investimento_usuario FOREIGN KEY (id_usuario) REFERENCES T_USUARIO (id_usuario) ON DELETE CASCADE
);
