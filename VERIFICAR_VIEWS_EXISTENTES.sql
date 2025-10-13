-- ============================================================================
-- SCRIPT: Verificar VIEWs existentes antes de criar nova
-- Propósito: Analisar o que já existe no banco
-- ============================================================================

USE AllMoove;
GO

-- 1. Listar todas as VIEWs relacionadas a Pedidos/Produtos
PRINT '=== VIEWS EXISTENTES NO BANCO ===';
PRINT '';

SELECT
    name AS Nome_View,
    create_date AS Data_Criacao,
    modify_date AS Data_Modificacao
FROM sys.views
WHERE name LIKE '%PEDIDO%'
   OR name LIKE '%PRODUTO%'
   OR name LIKE '%DISTRIBUIDOR%'
ORDER BY name;
GO

-- 2. Se a VIEW que queremos criar já existe, mostrar sua definição
IF EXISTS (SELECT * FROM sys.views WHERE name = 'VIEW_ULTIMOS_PEDIDOS_PRODUTOS_DETALHADO')
BEGIN
    PRINT '';
    PRINT '⚠️ VIEW_ULTIMOS_PEDIDOS_PRODUTOS_DETALHADO JÁ EXISTE!';
    PRINT 'Definição atual:';
    PRINT '';

    SELECT OBJECT_DEFINITION(OBJECT_ID('VIEW_ULTIMOS_PEDIDOS_PRODUTOS_DETALHADO')) AS Definicao;
END
ELSE
BEGIN
    PRINT '';
    PRINT '✅ VIEW_ULTIMOS_PEDIDOS_PRODUTOS_DETALHADO não existe. Seguro criar!';
END
GO

-- 3. Verificar se há dependências (procedures, triggers, etc) que usam VIEWs de pedidos
PRINT '';
PRINT '=== OBJETOS QUE DEPENDEM DAS VIEWS EXISTENTES ===';
PRINT '';

SELECT DISTINCT
    v.name AS View_Name,
    OBJECT_NAME(d.referencing_id) AS Objeto_Dependente,
    o.type_desc AS Tipo_Objeto
FROM sys.views v
LEFT JOIN sys.sql_expression_dependencies d ON v.object_id = d.referenced_id
LEFT JOIN sys.objects o ON d.referencing_id = o.object_id
WHERE v.name LIKE '%PEDIDO%'
   OR v.name LIKE '%PRODUTO%'
ORDER BY v.name, Tipo_Objeto;
GO

-- 4. Verificar AppDbContext.cs para ver VIEWs registradas
PRINT '';
PRINT '=== VIEWS ENCONTRADAS NO CÓDIGO (AppDbContext.cs) ===';
PRINT 'ViewDistribuidorUltimosPedidos_s -> View_Distribuidor_Ultimos_Pedidos';
PRINT 'ViewDistribuidorFavoritos -> View_Distribuidor_Favorito';
PRINT 'ViewDistribuidorConsultas -> View_Distribuidor_Consulta';
PRINT 'ViewProdutoEscolhaCarrinhos -> View_Produto_Escolha_Carrinho';
PRINT '';

-- 5. Mostrar estrutura da VIEW que vamos substituir (se existir)
IF EXISTS (SELECT * FROM sys.views WHERE name = 'View_Distribuidor_Ultimos_Pedidos')
BEGIN
    PRINT '';
    PRINT '📋 VIEW ATUAL: View_Distribuidor_Ultimos_Pedidos';
    PRINT 'Esta é a VIEW que retorna distribuidores (NÃO produtos)';
    PRINT '';

    -- Ver primeiros registros
    SELECT TOP 3 * FROM View_Distribuidor_Ultimos_Pedidos;
END
GO

PRINT '';
PRINT '============================================================================';
PRINT '✅ ANÁLISE CONCLUÍDA';
PRINT '============================================================================';
