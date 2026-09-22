-- ============================================================
-- V2: Adiciona campos DATA e CATEGORIA em todas as transações
-- ============================================================

-- 1. DESPESA: adicionar data e categoria
ALTER TABLE T_DESPESA
    ADD COLUMN dt_despesa DATE DEFAULT CURRENT_DATE,
    ADD COLUMN ds_categoria VARCHAR(50) DEFAULT 'Outros';

-- 2. RECEITA: adicionar data e categoria
ALTER TABLE T_RECEITA
    ADD COLUMN dt_receita DATE DEFAULT CURRENT_DATE,
    ADD COLUMN ds_categoria VARCHAR(50) DEFAULT 'Outros';

-- 3. INVESTIMENTO: adicionar data e categoria
ALTER TABLE T_INVESTIMENTO
    ADD COLUMN dt_investimento DATE DEFAULT CURRENT_DATE,
    ADD COLUMN ds_categoria VARCHAR(50) DEFAULT 'Outros';

-- 4. INVESTIMENTO: migrar dados do formato "Categoria | Descrição"
--    para campos separados (apenas registros que contêm o pipe)
UPDATE T_INVESTIMENTO
SET ds_categoria    = TRIM(split_part(ds_investimento, ' | ', 1)),
    ds_investimento = TRIM(split_part(ds_investimento, ' | ', 2))
WHERE ds_investimento LIKE '% | %';
