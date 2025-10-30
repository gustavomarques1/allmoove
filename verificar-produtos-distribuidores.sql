-- ========================================
-- VERIFICAR DISTRIBUIÇÃO DE PRODUTOS POR DISTRIBUIDOR
-- ========================================

USE allmoove;
GO

-- 1. VER QUANTOS PRODUTOS CADA DISTRIBUIDOR TEM
PRINT '📊 Produtos por Distribuidor:';
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

-- 2. VER TODOS OS DISTRIBUIDORES CADASTRADOS
PRINT '';
PRINT '👥 Distribuidores Cadastrados:';
GO

SELECT
    ID,
    NOME,
    TIPO,
    LOGIN
FROM dbo.PESSOA
WHERE TIPO LIKE '%DISTRIBUIDOR%'
  AND SITUACAO_REGISTRO = 'ATIVO'
ORDER BY ID;
GO

-- 3. VER PRODUTOS SEM DISTRIBUIDOR
PRINT '';
PRINT '⚠️ Produtos sem Distribuidor:';
GO

SELECT COUNT(*) AS Total
FROM dbo.PRODUTO
WHERE ID_DISTRIBUIDOR IS NULL
  AND SITUACAO_REGISTRO = 'ATIVO';
GO

-- 4. ATRIBUIR PRODUTOS AO DISTRIBUIDOR 18 (se necessário)
-- Descomente as linhas abaixo para executar

/*
PRINT '';
PRINT '🔄 Atribuindo alguns produtos ao distribuidor ID 18...';
GO

-- Pega os 15 primeiros produtos do distribuidor 20 e reatribui para o 18
UPDATE TOP(15) dbo.PRODUTO
SET ID_DISTRIBUIDOR = 18,
    DATA_HORA_ALTERACAO_REGISTRO = GETDATE(),
    USUARIO_ALTERACAO = 'SISTEMA_REDISTRIBUICAO'
WHERE ID_DISTRIBUIDOR = 20
  AND SITUACAO_REGISTRO = 'ATIVO';

PRINT '✅ Produtos reatribuídos!';
GO

-- Verificar resultado
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
*/
