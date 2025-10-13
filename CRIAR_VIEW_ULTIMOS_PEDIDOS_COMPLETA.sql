-- ============================================================================
-- SCRIPT: Criar VIEW para Últimos Pedidos com Produtos
-- Banco: allmoove
-- ============================================================================

USE allmoove;
GO

-- ============================================================================
-- VIEW_ULTIMOS_PEDIDOS_PRODUTOS
-- Retorna os produtos dos últimos pedidos de uma assistência técnica
-- ============================================================================

IF EXISTS (SELECT * FROM sys.views WHERE name = 'VIEW_ULTIMOS_PEDIDOS_PRODUTOS')
    DROP VIEW VIEW_ULTIMOS_PEDIDOS_PRODUTOS;
GO

CREATE VIEW VIEW_ULTIMOS_PEDIDOS_PRODUTOS AS
SELECT
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

    -- Dados do produto (distribuidor e segmento)
    p.ID_DISTRIBUIDOR AS ID_DISTRIBUIDOR,
    p.ID_SEGMENTO AS ID_SEGMENTO,
    COALESCE(pes.NOME, 'Distribuidor Desconhecido') AS NOME_DISTRIBUIDOR,

    -- Total do item
    (pi.QUANTIDADE * pi.PRECO_UNITARIO) AS VALOR_TOTAL_ITEM

FROM PEDIDO ped
INNER JOIN PEDIDO_ITEM pi ON pi.ID_PEDIDO = ped.ID
LEFT JOIN PRODUTO p ON p.ID = pi.ID_PRODUTO
LEFT JOIN PESSOA pes ON pes.ID = p.ID_DISTRIBUIDOR
WHERE ped.SITUACAO_REGISTRO = 'ATIVO';

GO

PRINT '✅ VIEW_ULTIMOS_PEDIDOS_PRODUTOS criada com sucesso!';
GO

-- Testar a VIEW
SELECT TOP 10 *
FROM VIEW_ULTIMOS_PEDIDOS_PRODUTOS
ORDER BY DATA_PEDIDO DESC;
GO

PRINT '';
PRINT '============================================================================';
PRINT '✅ VIEW CRIADA COM SUCESSO!';
PRINT '============================================================================';
PRINT '';
PRINT '📋 COMO USAR NO BACKEND:';
PRINT '';
PRINT '1. Criar o modelo ViewUltimosPedidosProdutos.cs:';
PRINT '';
PRINT '   [Table("VIEW_ULTIMOS_PEDIDOS_PRODUTOS")]';
PRINT '   public class ViewUltimosPedidosProdutos {';
PRINT '       public long IdPedido { get; set; }';
PRINT '       public long IdAssistencia { get; set; }';
PRINT '       public string CodigoPedido { get; set; }';
PRINT '       public DateTime? DataPedido { get; set; }';
PRINT '       public string StatusPedido { get; set; }';
PRINT '       public long IdPedidoItem { get; set; }';
PRINT '       public long IdProduto { get; set; }';
PRINT '       public int Quantidade { get; set; }';
PRINT '       public decimal PrecoUnitario { get; set; }';
PRINT '       public string NomeProduto { get; set; }';
PRINT '       public long? IdDistribuidor { get; set; }';
PRINT '       public long? IdSegmento { get; set; }';
PRINT '       public string NomeDistribuidor { get; set; }';
PRINT '       public decimal ValorTotalItem { get; set; }';
PRINT '   }';
PRINT '';
PRINT '2. Criar endpoint no DistribuidorController ou PedidosController:';
PRINT '';
PRINT '   [HttpGet("ultimospedidos-produtos/{idAssistencia}")]';
PRINT '   public async Task<ActionResult> GetUltimosPedidosProdutos(long idAssistencia)';
PRINT '';
PRINT '3. Usar no frontend:';
PRINT '';
PRINT '   const pedidos = await api.get(`/api/Pedidos/ultimospedidos-produtos/${userId}`);';
PRINT '';
GO
