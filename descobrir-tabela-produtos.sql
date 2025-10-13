-- ========================================
-- Script para Descobrir Nome da Tabela de Produtos
-- Banco: allmoove
-- ========================================

USE allmoove;
GO

-- 1. Listar TODAS as tabelas do banco allmoove
SELECT
    TABLE_SCHEMA as [Schema],
    TABLE_NAME as [Tabela]
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_SCHEMA, TABLE_NAME;

-- 2. Procurar tabelas com nome parecido com "Produto"
SELECT
    TABLE_SCHEMA as [Schema],
    TABLE_NAME as [Tabela]
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME LIKE '%Produto%'
    OR TABLE_NAME LIKE '%Product%'
ORDER BY TABLE_SCHEMA, TABLE_NAME;

-- 3. Ver colunas de uma possível tabela de produtos
-- Descomente e ajuste o nome da tabela após descobrir:
/*
SELECT
    COLUMN_NAME as [Coluna],
    DATA_TYPE as [Tipo],
    IS_NULLABLE as [Aceita Null]
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Produtos'  -- AJUSTE AQUI SE NECESSÁRIO
ORDER BY ORDINAL_POSITION;
*/
