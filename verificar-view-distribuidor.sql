-- ========================================
-- Verificar e corrigir VIEW_DISTRIBUIDOR_CONSULTA
-- ========================================

USE allmoove;
GO

-- 1. Ver a definição atual da VIEW
PRINT '📋 Definição atual da VIEW_DISTRIBUIDOR_CONSULTA:';
PRINT '';
GO

SELECT OBJECT_DEFINITION(OBJECT_ID('dbo.VIEW_DISTRIBUIDOR_CONSULTA')) AS ViewDefinition;
GO

-- 2. Ver os dados que a view retorna (sem ORDER BY na coluna que pode não existir)
PRINT '';
PRINT '📊 Dados da VIEW (sem filtro):';
PRINT '';
GO

SELECT * FROM dbo.VIEW_DISTRIBUIDOR_CONSULTA;
GO

-- 3. Ver todas as colunas da VIEW
PRINT '';
PRINT '📋 Colunas disponíveis na VIEW:';
PRINT '';
GO

SELECT
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'VIEW_DISTRIBUIDOR_CONSULTA'
ORDER BY ORDINAL_POSITION;
GO
