-- Usando gen_random_uuid() nativo do PostgreSQL 13+ (compatível com Neon)
-- Sem aspas duplas: PostgreSQL converte tudo para minúsculas internamente,
-- que é o comportamento esperado pelo Hibernate com ddl-auto=validate

CREATE TABLE t_usuario (
    id_usuario   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    nm_usuario   VARCHAR(100) NOT NULL,
    email        VARCHAR(100) NOT NULL UNIQUE,
    senha        VARCHAR(100) NOT NULL,
    cpf_usuario  VARCHAR(15)  NOT NULL UNIQUE,
    telefone     VARCHAR(15)  NOT NULL
);

CREATE TABLE t_despesa (
    id_despesa   UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    ds_despesa   VARCHAR(255),
    vl_despesa   DECIMAL(19, 2),
    dt_despesa   DATE           DEFAULT CURRENT_DATE,
    ds_categoria VARCHAR(50)    DEFAULT 'Outros',
    id_usuario   UUID           NOT NULL,
    CONSTRAINT fk_despesa_usuario FOREIGN KEY (id_usuario) REFERENCES t_usuario (id_usuario) ON DELETE CASCADE
);

CREATE TABLE t_receita (
    id_receita   UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    ds_receita   VARCHAR(255),
    vl_receita   DECIMAL(19, 2),
    dt_receita   DATE           DEFAULT CURRENT_DATE,
    ds_categoria VARCHAR(50)    DEFAULT 'Outros',
    id_usuario   UUID           NOT NULL,
    CONSTRAINT fk_receita_usuario FOREIGN KEY (id_usuario) REFERENCES t_usuario (id_usuario) ON DELETE CASCADE
);

CREATE TABLE t_investimento (
    id_investimento UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    ds_investimento VARCHAR(255),
    vl_investimento DECIMAL(19, 2),
    dt_investimento DATE           DEFAULT CURRENT_DATE,
    ds_categoria    VARCHAR(50)    DEFAULT 'Outros',
    id_usuario      UUID           NOT NULL,
    CONSTRAINT fk_investimento_usuario FOREIGN KEY (id_usuario) REFERENCES t_usuario (id_usuario) ON DELETE CASCADE
);
