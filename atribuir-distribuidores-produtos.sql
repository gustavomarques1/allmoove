-- ========================================
-- Script: Atribuir ID_DISTRIBUIDOR aos produtos
-- Data: 2025-10-24
-- ========================================

USE allmoove;
GO

-- ========================================
-- PASSO 1: Verificar produtos sem distribuidor
-- ========================================
PRINT '🔍 Verificando produtos sem ID_DISTRIBUIDOR...';
GO

SELECT
    ID,
    NOME,
    ID_DISTRIBUIDOR,
    SITUACAO_REGISTRO,
    DESCRICAO
FROM dbo.PRODUTO
WHERE ID_DISTRIBUIDOR IS NULL
  AND SITUACAO_REGISTRO = 'ATIVO'
ORDER BY ID;
GO

PRINT '';
PRINT '📊 Total de produtos sem distribuidor:';
GO

SELECT COUNT(*) AS Total
FROM dbo.PRODUTO
WHERE ID_DISTRIBUIDOR IS NULL
  AND SITUACAO_REGISTRO = 'ATIVO';
GO

-- ========================================
-- PASSO 2: Verificar distribuidores disponíveis
-- ========================================
PRINT '';
PRINT '🏪 Distribuidores disponíveis:';
GO

SELECT
    ID,
    NOME,
    TIPO
FROM dbo.PESSOA
WHERE TIPO LIKE '%DISTRIBUIDOR%'
  AND SITUACAO_REGISTRO = 'ATIVO'
ORDER BY ID;
GO

-- ========================================
-- PASSO 3: Atribuir distribuidores aos produtos
-- ========================================
PRINT '';
PRINT '✏️ Atribuindo distribuidores aos produtos...';
GO

-- Estratégia: Distribuir produtos uniformemente entre os 4 distribuidores
-- Distribuidor 20: TechParts SP
-- Distribuidor 21: Global Peças RJ
-- Distribuidor 22: ImportaCell
-- Distribuidor 23: Display Brasil

DECLARE @Contador INT = 0;
DECLARE @IdDistribuidor BIGINT;

DECLARE produto_cursor CURSOR FOR
SELECT ID FROM dbo.PRODUTO
WHERE ID_DISTRIBUIDOR IS NULL
  AND SITUACAO_REGISTRO = 'ATIVO'
ORDER BY ID;

OPEN produto_cursor;
DECLARE @IdProduto BIGINT;

FETCH NEXT FROM produto_cursor INTO @IdProduto;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Distribuir ciclicamente entre os 4 distribuidores
    SET @Contador = @Contador + 1;

    IF @Contador % 4 = 1
        SET @IdDistribuidor = 20; -- TechParts SP
    ELSE IF @Contador % 4 = 2
        SET @IdDistribuidor = 21; -- Global Peças RJ
    ELSE IF @Contador % 4 = 3
        SET @IdDistribuidor = 22; -- ImportaCell
    ELSE
        SET @IdDistribuidor = 23; -- Display Brasil

    UPDATE dbo.PRODUTO
    SET ID_DISTRIBUIDOR = @IdDistribuidor,
        DATA_HORA_ALTERACAO_REGISTRO = GETDATE(),
        USUARIO_ALTERACAO = 'SISTEMA_MIGRACAO'
    WHERE ID = @IdProduto;

    PRINT '✅ Produto ' + CAST(@IdProduto AS VARCHAR) + ' atribuído ao distribuidor ' + CAST(@IdDistribuidor AS VARCHAR);

    FETCH NEXT FROM produto_cursor INTO @IdProduto;
END;

CLOSE produto_cursor;
DEALLOCATE produto_cursor;
GO

-- ========================================
-- PASSO 4: Verificar resultado
-- ========================================
PRINT '';
PRINT '📊 Distribuição final de produtos por distribuidor:';
GO

SELECT
    p.ID_DISTRIBUIDOR,
    pes.NOME AS NomeDistribuidor,
    COUNT(*) AS TotalProdutos
FROM dbo.PRODUTO p
LEFT JOIN dbo.PESSOA pes ON p.ID_DISTRIBUIDOR = pes.ID
WHERE p.SITUACAO_REGISTRO = 'ATIVO'
GROUP BY p.ID_DISTRIBUIDOR, pes.NOME
ORDER BY p.ID_DISTRIBUIDOR;
GO

-- ========================================
-- PASSO 5: Produtos ainda sem distribuidor (se houver)
-- ========================================
PRINT '';
PRINT '⚠️ Produtos ainda sem distribuidor (se houver):';
GO

SELECT
    ID,
    NOME,
    ID_DISTRIBUIDOR
FROM dbo.PRODUTO
WHERE ID_DISTRIBUIDOR IS NULL
  AND SITUACAO_REGISTRO = 'ATIVO';
GO

DECLARE @ProdutosSemDistribuidor INT;
SELECT @ProdutosSemDistribuidor = COUNT(*)
FROM dbo.PRODUTO
WHERE ID_DISTRIBUIDOR IS NULL
  AND SITUACAO_REGISTRO = 'ATIVO';

IF @ProdutosSemDistribuidor = 0
BEGIN
    PRINT '';
    PRINT '✅ SUCESSO! Todos os produtos ativos têm distribuidor atribuído!';
END
ELSE
BEGIN
    PRINT '';
    PRINT '⚠️ ATENÇÃO: Ainda existem ' + CAST(@ProdutosSemDistribuidor AS VARCHAR) + ' produto(s) sem distribuidor.';
END
GO

-- ========================================
-- PASSO 6 (OPCIONAL): Visualizar amostra de produtos
-- ========================================
PRINT '';
PRINT '📦 Amostra de 10 produtos com distribuidores:';
GO

SELECT TOP 10
    p.ID,
    p.NOME,
    p.ID_DISTRIBUIDOR,
    pes.NOME AS NomeDistribuidor,
    p.PRECO_VENDA_PIX,
    p.QUANTIDADE AS Estoque
FROM dbo.PRODUTO p
LEFT JOIN dbo.PESSOA pes ON p.ID_DISTRIBUIDOR = pes.ID
WHERE p.SITUACAO_REGISTRO = 'ATIVO'
ORDER BY p.ID DESC;
GO

PRINT '';
PRINT '✅ Script concluído!';
PRINT '';
PRINT '🔄 Próximo passo: Reinicie o backend para ver as mudanças refletidas na API.';
GO
