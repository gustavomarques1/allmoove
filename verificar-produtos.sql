-- ========================================
-- VERIFICAR E POPULAR TABELA DE PRODUTOS
-- ========================================

USE allmoove;
GO

-- 1. Verificar se tabela PRODUTOS existe
PRINT '📋 VERIFICANDO TABELA PRODUTOS:';
GO

SELECT COUNT(*) AS TotalProdutos FROM dbo.PRODUTOS WHERE SITUACAO_REGISTRO = 'ATIVO';
GO

-- 2. Ver estrutura da tabela
PRINT '';
PRINT '🔍 ESTRUTURA DA TABELA PRODUTOS:';
GO

SELECT TOP 5 * FROM dbo.PRODUTOS WHERE SITUACAO_REGISTRO = 'ATIVO';
GO

-- 3. Verificar se produtos têm ID_DISTRIBUIDOR válido
PRINT '';
PRINT '⚠️ PRODUTOS SEM DISTRIBUIDOR:';
GO

SELECT COUNT(*) AS ProdutosSemDistribuidor
FROM dbo.PRODUTOS
WHERE SITUACAO_REGISTRO = 'ATIVO'
  AND (ID_DISTRIBUIDOR IS NULL OR ID_DISTRIBUIDOR NOT IN (SELECT ID FROM dbo.PESSOA));
GO

-- 4. Listar distribuidores disponíveis
PRINT '';
PRINT '🏪 DISTRIBUIDORES DISPONÍVEIS:';
GO

SELECT
    P.ID,
    P.NOME,
    P.CPFCNPJ,
    P.SITUACAO_REGISTRO
FROM dbo.PESSOA P
INNER JOIN dbo.PESSOA_PAPEL PP ON P.ID = PP.ID_PESSOA
WHERE PP.ID_PAPEL = 4 -- 4 = DISTRIBUIDOR
  AND P.SITUACAO_REGISTRO = 'ATIVO';
GO

-- 5. Se não há produtos, criar alguns de teste
PRINT '';
PRINT '✅ CRIANDO PRODUTOS DE TESTE (se necessário):';
GO

-- Buscar primeiro distribuidor ativo
DECLARE @IdDistribuidor BIGINT;

SELECT TOP 1 @IdDistribuidor = P.ID
FROM dbo.PESSOA P
INNER JOIN dbo.PESSOA_PAPEL PP ON P.ID = PP.ID_PESSOA
WHERE PP.ID_PAPEL = 4 -- DISTRIBUIDOR
  AND P.SITUACAO_REGISTRO = 'ATIVO';

-- Inserir produtos de teste se @IdDistribuidor existe
IF @IdDistribuidor IS NOT NULL
BEGIN
    PRINT '🔧 Inserindo produtos de teste...';

    -- Verificar se já existem produtos
    IF NOT EXISTS (SELECT 1 FROM dbo.PRODUTOS WHERE SITUACAO_REGISTRO = 'ATIVO')
    BEGIN
        -- Inserir produtos de celular
        INSERT INTO dbo.PRODUTOS (NOME, DESCRICAO, PRECO_VENDA_PIX, QUANTIDADE, ID_DISTRIBUIDOR, FRETE_GRATIS, SITUACAO_REGISTRO, DATA_HORA_CRIACAO_REGISTRO, SITUACAO, SKU)
        VALUES
        ('iPhone 12 Pro Max', 'Categoria: celulares', 5499.90, 10, @IdDistribuidor, 1, 'ATIVO', GETDATE(), 'ATIVO', 'IP12PROMAX'),
        ('Samsung Galaxy S21', 'Categoria: celulares', 3999.90, 15, @IdDistribuidor, 1, 'ATIVO', GETDATE(), 'ATIVO', 'SGS21'),
        ('Xiaomi Redmi Note 10', 'Categoria: celulares', 1499.90, 20, @IdDistribuidor, 1, 'ATIVO', GETDATE(), 'ATIVO', 'XRN10'),
        ('Motorola Moto G', 'Categoria: celulares', 999.90, 25, @IdDistribuidor, 1, 'ATIVO', GETDATE(), 'ATIVO', 'MMG');

        -- Inserir produtos de notebook
        INSERT INTO dbo.PRODUTOS (NOME, DESCRICAO, PRECO_VENDA_PIX, QUANTIDADE, ID_DISTRIBUIDOR, FRETE_GRATIS, SITUACAO_REGISTRO, DATA_HORA_CRIACAO_REGISTRO, SITUACAO, SKU)
        VALUES
        ('Dell Inspiron 15', 'Categoria: notebooks', 3499.90, 5, @IdDistribuidor, 1, 'ATIVO', GETDATE(), 'ATIVO', 'DELLI15'),
        ('Lenovo IdeaPad 3', 'Categoria: notebooks', 2799.90, 8, @IdDistribuidor, 1, 'ATIVO', GETDATE(), 'ATIVO', 'LENIP3'),
        ('HP Pavilion 14', 'Categoria: notebooks', 4199.90, 6, @IdDistribuidor, 1, 'ATIVO', GETDATE(), 'ATIVO', 'HPP14');

        -- Inserir produtos de telas
        INSERT INTO dbo.PRODUTOS (NOME, DESCRICAO, PRECO_VENDA_PIX, QUANTIDADE, ID_DISTRIBUIDOR, FRETE_GRATIS, SITUACAO_REGISTRO, DATA_HORA_CRIACAO_REGISTRO, SITUACAO, SKU)
        VALUES
        ('Tela LCD iPhone X', 'Categoria: telas', 399.90, 30, @IdDistribuidor, 0, 'ATIVO', GETDATE(), 'ATIVO', 'TLCDIPX'),
        ('Display Samsung A51', 'Categoria: telas', 299.90, 25, @IdDistribuidor, 0, 'ATIVO', GETDATE(), 'ATIVO', 'DSPSA51');

        PRINT '✅ 9 produtos de teste criados com sucesso!';
    END
    ELSE
    BEGIN
        PRINT 'ℹ️ Já existem produtos cadastrados. Nenhum produto foi inserido.';
    END
END
ELSE
BEGIN
    PRINT '❌ ERRO: Nenhum distribuidor encontrado! Cadastre um distribuidor primeiro.';
END
GO

-- 6. Verificar resultado final
PRINT '';
PRINT '📊 RESULTADO FINAL:';
GO

SELECT
    P.ID,
    P.NOME,
    P.DESCRICAO,
    P.PRECO_VENDA_PIX,
    P.ID_DISTRIBUIDOR,
    PESSOA.NOME AS NomeDistribuidor,
    P.FRETE_GRATIS,
    P.SKU
FROM dbo.PRODUTOS P
LEFT JOIN dbo.PESSOA ON P.ID_DISTRIBUIDOR = PESSOA.ID
WHERE P.SITUACAO_REGISTRO = 'ATIVO'
ORDER BY P.ID DESC;
GO
