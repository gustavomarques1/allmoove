-- ============================================================================
-- VERIFICAR SE AS VIEWS TÊM DADOS
-- ============================================================================

USE allmoove;
GO

PRINT '============================================================================';
PRINT '🔍 VERIFICANDO DADOS NAS VIEWS';
PRINT '============================================================================';
PRINT '';

-- 1. VIEW_DISTRIBUIDOR_CONSULTA
PRINT '📋 1. VIEW_DISTRIBUIDOR_CONSULTA:';
PRINT '------------------------------------------------------------';

SELECT COUNT(*) AS [Total de Registros] FROM VIEW_DISTRIBUIDOR_CONSULTA;

SELECT TOP 5
    ID_DISTRIBUIDOR,
    ID_SEGMENTO,
    NOME,
    CPFCNPJ
FROM VIEW_DISTRIBUIDOR_CONSULTA
ORDER BY ID_DISTRIBUIDOR;

PRINT '';
PRINT '';

-- 2. VIEW_DISTRIBUIDOR_ULTIMOS_PEDIDOS
PRINT '📋 2. VIEW_DISTRIBUIDOR_ULTIMOS_PEDIDOS:';
PRINT '------------------------------------------------------------';

SELECT COUNT(*) AS [Total de Registros] FROM VIEW_DISTRIBUIDOR_ULTIMOS_PEDIDOS;

SELECT TOP 5
    ID_DISTRIBUIDOR,
    ID_ASSISTENCIA,
    NOME,
    CPFCNPJ
FROM VIEW_DISTRIBUIDOR_ULTIMOS_PEDIDOS
ORDER BY ID_DISTRIBUIDOR;

PRINT '';
PRINT '';

-- 3. VIEW_DISTRIBUIDOR_FAVORITO
PRINT '📋 3. VIEW_DISTRIBUIDOR_FAVORITO:';
PRINT '------------------------------------------------------------';

SELECT COUNT(*) AS [Total de Registros] FROM VIEW_DISTRIBUIDOR_FAVORITO;

SELECT TOP 5
    ID_DISTRIBUIDOR,
    ID_ASSISTENCIA,
    ID_SEGMENTO,
    NOME,
    CPFCNPJ
FROM VIEW_DISTRIBUIDOR_FAVORITO
ORDER BY ID_DISTRIBUIDOR;

PRINT '';
PRINT '============================================================================';
PRINT '✅ VERIFICAÇÃO CONCLUÍDA';
PRINT '============================================================================';
GO
