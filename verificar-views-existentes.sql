-- ============================================================================
-- SCRIPT: Verificar VIEWs existentes no banco
-- ============================================================================

USE allmoove;
GO

-- Listar TODAS as views que existem no banco
SELECT
    SCHEMA_NAME(v.schema_id) AS [Schema],
    v.name AS [Nome da View],
    v.create_date AS [Data Criação],
    v.modify_date AS [Data Modificação]
FROM sys.views v
ORDER BY v.name;
GO

-- Procurar views relacionadas a DISTRIBUIDOR, PESSOA, SEGMENTO, FAVORITO, PEDIDOS
PRINT '';
PRINT '============================================================================';
PRINT '🔍 VIEWS RELACIONADAS A DISTRIBUIDOR/FAVORITOS/PEDIDOS:';
PRINT '============================================================================';
PRINT '';

SELECT
    SCHEMA_NAME(v.schema_id) + '.' + v.name AS [View Completa]
FROM sys.views v
WHERE v.name LIKE '%DISTRIBUIDOR%'
   OR v.name LIKE '%FAVORITO%'
   OR v.name LIKE '%PEDIDO%'
   OR v.name LIKE '%SEGMENTO%'
   OR v.name LIKE '%PESSOA%'
ORDER BY v.name;
GO

-- Ver estrutura da view PESSOA_SEGMENTO_FAVORITO (que você mencionou)
IF EXISTS (SELECT * FROM sys.views WHERE name = 'PESSOA_SEGMENTO_FAVORITO')
BEGIN
    PRINT '';
    PRINT '============================================================================';
    PRINT '📋 ESTRUTURA DA VIEW: PESSOA_SEGMENTO_FAVORITO';
    PRINT '============================================================================';
    PRINT '';

    SELECT
        c.name AS [Coluna],
        t.name AS [Tipo],
        c.max_length AS [Tamanho],
        c.is_nullable AS [Aceita Null]
    FROM sys.columns c
    INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
    WHERE c.object_id = OBJECT_ID('dbo.PESSOA_SEGMENTO_FAVORITO')
    ORDER BY c.column_id;

    -- Mostrar alguns dados de exemplo
    PRINT '';
    PRINT 'Exemplo de dados (TOP 5):';
    PRINT '';

    SELECT TOP 5 * FROM dbo.PESSOA_SEGMENTO_FAVORITO;
END
ELSE
BEGIN
    PRINT '⚠️ View PESSOA_SEGMENTO_FAVORITO não encontrada';
END
GO
