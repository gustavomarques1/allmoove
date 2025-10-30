-- ========================================
-- CORRIGIR: Adicionar distribuidor ID 20 (TechParts SP)
-- ========================================

USE allmoove;
GO

-- 1. Verificar se a pessoa ID 20 existe
PRINT '👤 Verificando pessoa ID 20:';
GO

SELECT
    ID as ID_PESSOA,
    NOME,
    CPFCNPJ,
    TIPO,
    LOGIN
FROM dbo.PESSOA
WHERE ID = 20;
GO

-- 2. Verificar se já existe na tabela DISTRIBUIDORES
PRINT '';
PRINT '🔍 Verificando tabela DISTRIBUIDORES:';
GO

SELECT
    D.ID as ID_DISTRIBUIDOR,
    D.ID_PESSOA,
    P.NOME,
    P.CPFCNPJ
FROM dbo.DISTRIBUIDORES D
INNER JOIN dbo.PESSOA P ON D.ID_PESSOA = P.ID
WHERE D.ID_PESSOA = 20;
GO

-- 3. Se não existir, inserir na tabela DISTRIBUIDORES
PRINT '';
PRINT '➕ Inserindo distribuidor ID 20 (se não existir):';
GO

IF NOT EXISTS (SELECT 1 FROM dbo.DISTRIBUIDORES WHERE ID_PESSOA = 20)
BEGIN
    INSERT INTO dbo.DISTRIBUIDORES (ID_PESSOA)
    VALUES (20);

    PRINT '✅ Distribuidor ID 20 inserido com sucesso!';
END
ELSE
BEGIN
    PRINT '⚠️ Distribuidor ID 20 já existe na tabela DISTRIBUIDORES';
END
GO

-- 4. Verificar o resultado final
PRINT '';
PRINT '📊 Resultado final - Distribuidores:';
GO

SELECT
    D.ID as ID_DISTRIBUIDOR,
    D.ID_PESSOA,
    P.NOME,
    P.CPFCNPJ,
    P.LOGIN
FROM dbo.DISTRIBUIDORES D
INNER JOIN dbo.PESSOA P ON D.ID_PESSOA = P.ID
WHERE P.SITUACAO_REGISTRO = 'ATIVO'
ORDER BY D.ID;
GO

-- 5. Testar a VIEW após a correção
PRINT '';
PRINT '🔍 Testando VIEW_DISTRIBUIDOR_CONSULTA:';
GO

SELECT
    ID_DISTRIBUIDOR,
    ID_SEGMENTO,
    NOME,
    CPFCNPJ
FROM dbo.VIEW_DISTRIBUIDOR_CONSULTA
WHERE CPFCNPJ = '11111111111111'
ORDER BY ID_DISTRIBUIDOR, ID_SEGMENTO;
GO

PRINT '';
PRINT '✅ Script concluído! Agora faça login novamente.';
GO
