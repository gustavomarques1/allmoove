-- ============================================================================
-- SCRIPT: Criar VIEWs para APIs de Distribuidor
-- Banco: allmoove
-- ============================================================================

USE allmoove;
GO

-- ============================================================================
-- 1. VIEW_DISTRIBUIDOR_CONSULTA
-- Retorna distribuidores disponíveis por segmento
-- ============================================================================

IF EXISTS (SELECT * FROM sys.views WHERE name = 'VIEW_DISTRIBUIDOR_CONSULTA')
    DROP VIEW VIEW_DISTRIBUIDOR_CONSULTA;
GO

CREATE VIEW VIEW_DISTRIBUIDOR_CONSULTA AS
SELECT DISTINCT
    p.ID_DISTRIBUIDOR AS ID_DISTRIBUIDOR,
    p.ID_SEGMENTO AS ID_SEGMENTO,
    COALESCE(pes.NOME, 'Distribuidor Desconhecido') AS NOME,
    pes.CPFCNPJ AS CPFCNPJ
FROM PRODUTO p
LEFT JOIN PESSOA pes ON pes.ID = p.ID_DISTRIBUIDOR
WHERE p.ID_DISTRIBUIDOR IS NOT NULL
  AND p.ID_SEGMENTO IS NOT NULL;
GO

PRINT '✅ VIEW_DISTRIBUIDOR_CONSULTA criada com sucesso!';
GO

-- ============================================================================
-- 2. VIEW_DISTRIBUIDOR_ULTIMOS_PEDIDOS
-- Retorna os últimos pedidos de uma assistência técnica
-- ============================================================================

IF EXISTS (SELECT * FROM sys.views WHERE name = 'VIEW_DISTRIBUIDOR_ULTIMOS_PEDIDOS')
    DROP VIEW VIEW_DISTRIBUIDOR_ULTIMOS_PEDIDOS;
GO

CREATE VIEW VIEW_DISTRIBUIDOR_ULTIMOS_PEDIDOS AS
SELECT DISTINCT
    p.ID_DISTRIBUIDOR AS ID_DISTRIBUIDOR,
    ped.ID_PESSOA AS ID_ASSISTENCIA,
    COALESCE(pes.NOME, 'Distribuidor Desconhecido') AS NOME,
    pes.CPFCNPJ AS CPFCNPJ
FROM PEDIDO ped
INNER JOIN PEDIDO_ITEM pi ON pi.ID_PEDIDO = ped.ID
INNER JOIN PRODUTO p ON p.ID = pi.ID_PRODUTO
LEFT JOIN PESSOA pes ON pes.ID = p.ID_DISTRIBUIDOR
WHERE p.ID_DISTRIBUIDOR IS NOT NULL
  AND ped.ID_PESSOA IS NOT NULL;
GO

PRINT '✅ VIEW_DISTRIBUIDOR_ULTIMOS_PEDIDOS criada com sucesso!';
GO

-- ============================================================================
-- 3. VIEW_DISTRIBUIDOR_FAVORITO
-- Retorna distribuidores favoritos de uma assistência por segmento
-- ============================================================================

IF EXISTS (SELECT * FROM sys.views WHERE name = 'VIEW_DISTRIBUIDOR_FAVORITO')
    DROP VIEW VIEW_DISTRIBUIDOR_FAVORITO;
GO

CREATE VIEW VIEW_DISTRIBUIDOR_FAVORITO AS
SELECT DISTINCT
    p.ID_DISTRIBUIDOR AS ID_DISTRIBUIDOR,
    ped.ID_PESSOA AS ID_ASSISTENCIA,
    p.ID_SEGMENTO AS ID_SEGMENTO,
    COALESCE(pes.NOME, 'Distribuidor Desconhecido') AS NOME,
    pes.CPFCNPJ AS CPFCNPJ
FROM PEDIDO ped
INNER JOIN PEDIDO_ITEM pi ON pi.ID_PEDIDO = ped.ID
INNER JOIN PRODUTO p ON p.ID = pi.ID_PRODUTO
LEFT JOIN PESSOA pes ON pes.ID = p.ID_DISTRIBUIDOR
WHERE p.ID_DISTRIBUIDOR IS NOT NULL
  AND p.ID_SEGMENTO IS NOT NULL
  AND ped.ID_PESSOA IS NOT NULL;
GO

PRINT '✅ VIEW_DISTRIBUIDOR_FAVORITO criada com sucesso!';
GO

-- ============================================================================
-- VERIFICAR SE AS VIEWS FORAM CRIADAS
-- ============================================================================

SELECT
    'VIEW_DISTRIBUIDOR_CONSULTA' AS [VIEW],
    COUNT(*) AS [Linhas]
FROM VIEW_DISTRIBUIDOR_CONSULTA

UNION ALL

SELECT
    'VIEW_DISTRIBUIDOR_ULTIMOS_PEDIDOS',
    COUNT(*)
FROM VIEW_DISTRIBUIDOR_ULTIMOS_PEDIDOS

UNION ALL

SELECT
    'VIEW_DISTRIBUIDOR_FAVORITO',
    COUNT(*)
FROM VIEW_DISTRIBUIDOR_FAVORITO;

GO

PRINT '';
PRINT '============================================================================';
PRINT '✅ TODAS AS VIEWS FORAM CRIADAS COM SUCESSO!';
PRINT '============================================================================';
PRINT '';
PRINT '📋 PRÓXIMOS PASSOS:';
PRINT '   1. Recompile o backend (se necessário): dotnet build';
PRINT '   2. Reinicie a API';
PRINT '   3. Teste as APIs no navegador usando: testar-apis-distribuidor.js';
PRINT '';
GO
