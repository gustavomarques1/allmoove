-- ========================================
-- VALIDAR PEDIDO #90 (Recém Criado)
-- ========================================
-- Valida que o pedido foi criado com idDistribuidor correto

USE allmoove;
GO

PRINT '🔍 VALIDANDO PEDIDO #90';
PRINT '========================================';
PRINT '';

-- ========================================
-- 1. DADOS DO PEDIDO
-- ========================================
PRINT '1️⃣ Dados do Pedido #90:';
PRINT '';

SELECT
    P.ID as ID_PEDIDO,
    P.ID_GRUPO_PEDIDO,
    P.ID_PESSOA as ID_ASSISTENCIA,
    PESSOA_ASS.NOME as ASSISTENCIA,
    P.ID_DISTRIBUIDOR,
    PESSOA_DIST.NOME as DISTRIBUIDOR,
    P.SITUACAO,
    P.VALOR_FRETE,
    P.DATA_HORA_CRICAO_REGISTRO as DATA_CRIACAO
FROM dbo.PEDIDO P
LEFT JOIN dbo.PESSOA PESSOA_ASS ON P.ID_PESSOA = PESSOA_ASS.ID
LEFT JOIN dbo.PESSOA PESSOA_DIST ON P.ID_DISTRIBUIDOR = PESSOA_DIST.ID
WHERE P.ID = 90;

PRINT '';

-- ========================================
-- 2. ITEMS DO PEDIDO
-- ========================================
PRINT '2️⃣ Items do Pedido #90:';
PRINT '';

SELECT
    PI.ID as ID_ITEM,
    PI.ID_PEDIDO,
    PI.ID_PRODUTO,
    PI.NOME as PRODUTO,
    PI.QUANTIDADE,
    PI.PRECO,
    ISNULL(PI.DESCONTO, 0) as DESCONTO,
    (PI.PRECO * PI.QUANTIDADE - ISNULL(PI.DESCONTO, 0)) as SUBTOTAL
FROM dbo.PEDIDO_ITEM PI
WHERE PI.ID_PEDIDO = 90;

PRINT '';

-- ========================================
-- 3. VALIDAÇÃO
-- ========================================
PRINT '3️⃣ Validação:';
PRINT '';

DECLARE @idDistribuidor INT;
DECLARE @nomeDistribuidor VARCHAR(100);

SELECT
    @idDistribuidor = P.ID_DISTRIBUIDOR,
    @nomeDistribuidor = PESSOA_DIST.NOME
FROM dbo.PEDIDO P
LEFT JOIN dbo.PESSOA PESSOA_DIST ON P.ID_DISTRIBUIDOR = PESSOA_DIST.ID
WHERE P.ID = 90;

IF @idDistribuidor IS NOT NULL
BEGIN
    PRINT '✅ SUCESSO! Pedido está vinculado ao distribuidor:';
    PRINT '   ID: ' + CAST(@idDistribuidor AS VARCHAR);
    PRINT '   Nome: ' + ISNULL(@nomeDistribuidor, 'N/A');
    PRINT '';
    PRINT '🎉 A INTEGRAÇÃO ESTÁ FUNCIONANDO CORRETAMENTE!';
END
ELSE
BEGIN
    PRINT '❌ ERRO! Pedido NÃO está vinculado a nenhum distribuidor.';
    PRINT '   idDistribuidor está NULL';
END

PRINT '';
PRINT '========================================';

-- ========================================
-- 4. ESTATÍSTICAS GERAIS
-- ========================================
PRINT '4️⃣ Estatísticas Gerais:';
PRINT '';

DECLARE @totalPedidos INT;
DECLARE @comDistribuidor INT;
DECLARE @semDistribuidor INT;

SELECT @totalPedidos = COUNT(*) FROM dbo.PEDIDO;
SELECT @comDistribuidor = COUNT(*) FROM dbo.PEDIDO WHERE ID_DISTRIBUIDOR IS NOT NULL;
SELECT @semDistribuidor = COUNT(*) FROM dbo.PEDIDO WHERE ID_DISTRIBUIDOR IS NULL;

PRINT 'Total de pedidos no sistema: ' + CAST(@totalPedidos AS VARCHAR);
PRINT 'Pedidos COM distribuidor: ' + CAST(@comDistribuidor AS VARCHAR) + ' ✅';
PRINT 'Pedidos SEM distribuidor: ' + CAST(@semDistribuidor AS VARCHAR) +
      CASE WHEN @semDistribuidor > 0 THEN ' ⚠️ (provavelmente pedidos antigos)' ELSE ' ✅' END;

PRINT '';

-- Calcula percentual
DECLARE @percentual DECIMAL(5,2);
IF @totalPedidos > 0
    SET @percentual = (CAST(@comDistribuidor AS DECIMAL) / @totalPedidos) * 100;
ELSE
    SET @percentual = 0;

PRINT 'Percentual de vinculação: ' + CAST(@percentual AS VARCHAR) + '%';

PRINT '';
PRINT '✅ Validação concluída!';
