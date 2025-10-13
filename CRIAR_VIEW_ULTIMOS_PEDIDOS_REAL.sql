-- ============================================================================
-- SCRIPT: Criar VIEW Real de Últimos Pedidos com Produtos
-- Banco: allmoove
-- Propósito: Mostrar "FORNECEDOR - PRODUTO" dos últimos pedidos
-- ============================================================================

USE allmoove;
GO

-- ============================================================================
-- VIEW_ULTIMOS_PEDIDOS_PRODUTOS_DETALHADO
-- Retorna os produtos dos últimos pedidos com nome do fornecedor
-- ============================================================================

IF EXISTS (SELECT * FROM sys.views WHERE name = 'VIEW_ULTIMOS_PEDIDOS_PRODUTOS_DETALHADO')
    DROP VIEW VIEW_ULTIMOS_PEDIDOS_PRODUTOS_DETALHADO;
GO

CREATE VIEW VIEW_ULTIMOS_PEDIDOS_PRODUTOS_DETALHADO AS
SELECT TOP 100
    -- Dados do pedido
    ped.ID AS ID_PEDIDO,
    ped.ID_PESSOA AS ID_ASSISTENCIA,
    ped.CODIGO AS CODIGO_PEDIDO,
    ped.DATA_HORA_CRICAO_REGISTRO AS DATA_PEDIDO,
    ped.SITUACAO AS STATUS_PEDIDO,

    -- Dados do item
    pi.ID AS ID_PEDIDO_ITEM,
    pi.ID_PRODUTO AS ID_PRODUTO,
    pi.QUANTIDADE AS QUANTIDADE,
    pi.PRECO_UNITARIO AS PRECO_UNITARIO,
    pi.NOME AS NOME_PRODUTO,

    -- Dados do distribuidor/fornecedor
    p.ID_DISTRIBUIDOR AS ID_DISTRIBUIDOR,
    COALESCE(pes.NOME, 'Fornecedor Desconhecido') AS NOME_FORNECEDOR,

    -- Dados do segmento
    p.ID_SEGMENTO AS ID_SEGMENTO,

    -- Campo formatado: "FORNECEDOR - PRODUTO"
    COALESCE(pes.NOME, 'Fornecedor') + ' - ' + COALESCE(pi.NOME, 'Produto') AS FORNECEDOR_PRODUTO

FROM PEDIDO ped
INNER JOIN PEDIDO_ITEM pi ON pi.ID_PEDIDO = ped.ID
LEFT JOIN PRODUTO p ON p.ID = pi.ID_PRODUTO
LEFT JOIN PESSOA pes ON pes.ID = p.ID_DISTRIBUIDOR
WHERE ped.SITUACAO_REGISTRO = 'ATIVO'
ORDER BY ped.DATA_HORA_CRICAO_REGISTRO DESC;

GO

PRINT '✅ VIEW_ULTIMOS_PEDIDOS_PRODUTOS_DETALHADO criada com sucesso!';
GO

-- Testar a VIEW
PRINT '';
PRINT '🔍 Testando a VIEW:';
PRINT '';

SELECT TOP 10
    ID_ASSISTENCIA,
    FORNECEDOR_PRODUTO,
    DATA_PEDIDO,
    QUANTIDADE
FROM VIEW_ULTIMOS_PEDIDOS_PRODUTOS_DETALHADO
ORDER BY DATA_PEDIDO DESC;
GO

-- Contar registros por assistência
PRINT '';
PRINT '📊 Registros por assistência:';
PRINT '';

SELECT
    ID_ASSISTENCIA,
    COUNT(*) AS TOTAL_ITENS
FROM VIEW_ULTIMOS_PEDIDOS_PRODUTOS_DETALHADO
GROUP BY ID_ASSISTENCIA;
GO

PRINT '';
PRINT '============================================================================';
PRINT '✅ VIEW CRIADA E TESTADA COM SUCESSO!';
PRINT '============================================================================';
PRINT '';
PRINT '📋 COMO USAR NO BACKEND:';
PRINT '';
PRINT '1. Criar modelo C#: ViewUltimosPedidosProdutosDetalhado.cs';
PRINT '2. Criar endpoint: /api/Pedidos/ultimos-produtos/{idAssistencia}';
PRINT '3. Retornar: FORNECEDOR_PRODUTO, DATA_PEDIDO, QUANTIDADE';
PRINT '';
PRINT '📝 Exemplo de uso no frontend:';
PRINT '   - Lista mostra: "WE FIX - iPhone 16"';
PRINT '   - Atualiza automaticamente quando faz novo pedido';
PRINT '';
GO
