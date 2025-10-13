-- ========================================
-- SQL para Adicionar Coluna IMAGEM
-- Banco: allmoove
-- ========================================

USE allmoove;
GO

-- Adicionar coluna IMAGEM na tabela PRODUTO
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'PRODUTO' AND COLUMN_NAME = 'IMAGEM'
)
BEGIN
    ALTER TABLE PRODUTO ADD IMAGEM VARCHAR(255) NULL;
    PRINT '✅ Coluna IMAGEM adicionada com sucesso!';
END
ELSE
BEGIN
    PRINT '⚠️ Coluna IMAGEM já existe!';
END
GO

-- Verificar estrutura da tabela
SELECT
    COLUMN_NAME as [Coluna],
    DATA_TYPE as [Tipo],
    CHARACTER_MAXIMUM_LENGTH as [Tamanho],
    IS_NULLABLE as [Aceita Null]
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'PRODUTO'
ORDER BY ORDINAL_POSITION;
GO
