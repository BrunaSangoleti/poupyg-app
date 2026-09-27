-- ============================================================
-- V2: Migração de dados legados do formato "Categoria | Descrição"
-- (campos dt_* e ds_categoria já foram criados no V1)
-- ============================================================

-- Migrar investimentos que usavam o formato antigo de pipe
UPDATE t_investimento
SET ds_categoria    = TRIM(split_part(ds_investimento, ' | ', 1)),
    ds_investimento = TRIM(split_part(ds_investimento, ' | ', 2))
WHERE ds_investimento LIKE '% | %';
