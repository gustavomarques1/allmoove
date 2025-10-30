-- ========================================
-- DIAGNÓSTICO DO BANCO DE DADOS ALLMOOVE
-- ========================================
-- Este script ajuda a descobrir a estrutura correta do banco
-- e resolver problemas de "Nome de objeto inválido"

-- ========================================
-- 1. VERIFICAR DATABASE ATUAL
-- ========================================
PRINT '1️⃣ Verificando database atual...';
PRINT '';

SELECT DB_NAME() AS DatabaseAtual;

PRINT '';
PRINT '⚠️ Se o DatabaseAtual não for "allmoove", execute:';
PRINT 'USE allmoove;';
PRINT '';

-- ========================================
-- 2. TROCAR PARA O DATABASE CORRETO
-- ========================================
USE allmoove;
GO

PRINT '✅ Database alterado para: allmoove';
PRINT '';

-- ========================================
-- 3. LISTAR TODAS AS TABELAS DO BANCO
-- ========================================
PRINT '2️⃣ Listando todas as tabelas do banco allmoove...';
PRINT '';

SELECT
    SCHEMA_NAME(schema_id) AS [Schema],
    name AS Tabela,
    OBJECT_SCHEMA_NAME(object_id) + '.' + name AS NomeCompleto
FROM sys.tables
WHERE name LIKE '%PESSOA%'
   OR name LIKE '%PEDIDO%'
   OR name LIKE '%PRODUTO%'
   OR name LIKE '%DISTRIBUIDOR%'
ORDER BY name;

PRINT '';

-- ========================================
-- 4. VERIFICAR SE TABELA PESSOA EXISTE
-- ========================================
PRINT '3️⃣ Verificando se tabela PESSOA existe...';
PRINT '';

IF OBJECT_ID('dbo.PESSOA', 'U') IS NOT NULL
BEGIN
    PRINT '✅ Tabela dbo.PESSOA existe!';
    PRINT '';

    -- Mostra as colunas da tabela
    PRINT '📋 Colunas da tabela PESSOA:';
    SELECT
        COLUMN_NAME,
        DATA_TYPE,
        CHARACTER_MAXIMUM_LENGTH
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'PESSOA'
    ORDER BY ORDINAL_POSITION;
END
ELSE
BEGIN
    PRINT '❌ Tabela dbo.PESSOA NÃO ENCONTRADA!';
    PRINT '';
    PRINT '⚠️ Possíveis causas:';
    PRINT '1. Tabela está em outro schema (não dbo)';
    PRINT '2. Tabela tem nome diferente';
    PRINT '3. Migrations do Entity Framework não foram executadas';
    PRINT '';
END

-- ========================================
-- 5. TENTAR ACESSAR COM DIFERENTES SCHEMAS
-- ========================================
PRINT '4️⃣ Testando diferentes formas de acessar a tabela...';
PRINT '';

-- Testa dbo.PESSOA
IF OBJECT_ID('dbo.PESSOA', 'U') IS NOT NULL
BEGIN
    PRINT '✅ Acessível via: dbo.PESSOA';
    SELECT TOP 5 ID, NOME, TIPO FROM dbo.PESSOA;
END
ELSE
BEGIN
    PRINT '❌ NÃO acessível via: dbo.PESSOA';
END

PRINT '';

-- Testa PESSOA (sem schema)
DECLARE @sql NVARCHAR(MAX);
BEGIN TRY
    SET @sql = N'SELECT TOP 5 ID, NOME, TIPO FROM PESSOA';
    EXEC sp_executesql @sql;
    PRINT '✅ Acessível via: PESSOA (sem schema)';
END TRY
BEGIN CATCH
    PRINT '❌ NÃO acessível via: PESSOA (sem schema)';
    PRINT '   Erro: ' + ERROR_MESSAGE();
END CATCH

PRINT '';

-- ========================================
-- 6. BUSCAR DISTRIBUIDORES (se tabela existir)
-- ========================================
PRINT '5️⃣ Buscando distribuidores cadastrados...';
PRINT '';

IF OBJECT_ID('dbo.PESSOA', 'U') IS NOT NULL
BEGIN
    IF EXISTS (SELECT 1 FROM dbo.PESSOA WHERE TIPO = 'DISTRIBUIDOR')
    BEGIN
        PRINT '✅ Distribuidores encontrados:';
        PRINT '';

        SELECT
            ID,
            NOME,
            TIPO,
            LOGIN,
            CPFCNPJ,
            SITUACAO_REGISTRO
        FROM dbo.PESSOA
        WHERE TIPO = 'DISTRIBUIDOR'
          AND (SITUACAO_REGISTRO = 'ATIVO' OR SITUACAO_REGISTRO IS NULL);
    END
    ELSE
    BEGIN
        PRINT '⚠️ NENHUM DISTRIBUIDOR CADASTRADO!';
        PRINT '';
        PRINT '📝 Para criar um distribuidor de teste, execute:';
        PRINT '   Script: criar-distribuidor-teste.sql';
        PRINT '';
    END
END
ELSE
BEGIN
    PRINT '❌ Não foi possível buscar distribuidores (tabela PESSOA não encontrada)';
END

PRINT '';

-- ========================================
-- 7. VERIFICAR TABELA DE PEDIDOS
-- ========================================
PRINT '6️⃣ Verificando tabela de PEDIDOS...';
PRINT '';

IF OBJECT_ID('dbo.PEDIDO', 'U') IS NOT NULL
BEGIN
    PRINT '✅ Tabela dbo.PEDIDO existe!';
    PRINT '';

    -- Conta pedidos
    DECLARE @totalPedidos INT;
    SELECT @totalPedidos = COUNT(*) FROM dbo.PEDIDO;

    PRINT 'Total de pedidos: ' + CAST(@totalPedidos AS VARCHAR);
    PRINT '';

    -- Mostra pedidos com idDistribuidor
    IF @totalPedidos > 0
    BEGIN
        PRINT '📋 Últimos 5 pedidos:';
        SELECT TOP 5
            P.ID,
            P.ID_PESSOA,
            P.ID_DISTRIBUIDOR,
            P.STATUS,
            P.DATA_HORA_CRICAO_REGISTRO
        FROM dbo.PEDIDO P
        ORDER BY P.ID DESC;
    END
END
ELSE
BEGIN
    PRINT '⚠️ Tabela PEDIDO não encontrada';
END

PRINT '';

-- ========================================
-- 8. VERIFICAR TABELA DE PRODUTOS
-- ========================================
PRINT '7️⃣ Verificando tabela de PRODUTOS...';
PRINT '';

IF OBJECT_ID('dbo.PRODUTO', 'U') IS NOT NULL
BEGIN
    PRINT '✅ Tabela dbo.PRODUTO existe!';
    PRINT '';

    -- Conta produtos
    DECLARE @totalProdutos INT;
    SELECT @totalProdutos = COUNT(*) FROM dbo.PRODUTO;

    PRINT 'Total de produtos: ' + CAST(@totalProdutos AS VARCHAR);
    PRINT '';

    -- Mostra produtos com idDistribuidor
    IF @totalProdutos > 0
    BEGIN
        PRINT '📋 Primeiros 5 produtos:';
        SELECT TOP 5
            P.ID,
            P.NOME,
            P.ID_DISTRIBUIDOR
        FROM dbo.PRODUTO P;
    END
END
ELSE
BEGIN
    PRINT '⚠️ Tabela PRODUTO não encontrada';
END

PRINT '';

-- ========================================
-- 9. RESUMO E PRÓXIMOS PASSOS
-- ========================================
PRINT '========================================';
PRINT '📊 RESUMO DO DIAGNÓSTICO';
PRINT '========================================';
PRINT '';

-- Verifica se estrutura está OK
DECLARE @estruturaOK BIT = 1;

IF OBJECT_ID('dbo.PESSOA', 'U') IS NULL
BEGIN
    PRINT '❌ Tabela PESSOA não encontrada';
    SET @estruturaOK = 0;
END
ELSE
    PRINT '✅ Tabela PESSOA encontrada';

IF OBJECT_ID('dbo.PEDIDO', 'U') IS NULL
BEGIN
    PRINT '❌ Tabela PEDIDO não encontrada';
    SET @estruturaOK = 0;
END
ELSE
    PRINT '✅ Tabela PEDIDO encontrada';

IF OBJECT_ID('dbo.PRODUTO', 'U') IS NULL
BEGIN
    PRINT '❌ Tabela PRODUTO não encontrada';
    SET @estruturaOK = 0;
END
ELSE
    PRINT '✅ Tabela PRODUTO encontrada';

PRINT '';

IF @estruturaOK = 1
BEGIN
    PRINT '========================================';
    PRINT '✅ ESTRUTURA DO BANCO ESTÁ OK!';
    PRINT '========================================';
    PRINT '';
    PRINT '📝 Use estas queries para acessar as tabelas:';
    PRINT '';
    PRINT '-- Listar distribuidores:';
    PRINT 'SELECT * FROM dbo.PESSOA WHERE TIPO = ''DISTRIBUIDOR'';';
    PRINT '';
    PRINT '-- Listar pedidos:';
    PRINT 'SELECT * FROM dbo.PEDIDO;';
    PRINT '';
    PRINT '-- Listar produtos:';
    PRINT 'SELECT * FROM dbo.PRODUTO;';
    PRINT '';
END
ELSE
BEGIN
    PRINT '========================================';
    PRINT '❌ PROBLEMAS ENCONTRADOS!';
    PRINT '========================================';
    PRINT '';
    PRINT '⚠️ Possíveis soluções:';
    PRINT '';
    PRINT '1. Executar migrations do Entity Framework:';
    PRINT '   cd AllmooveApi';
    PRINT '   dotnet ef database update';
    PRINT '';
    PRINT '2. Verificar connection string no appsettings.json';
    PRINT '';
    PRINT '3. Verificar se está conectado no database correto';
    PRINT '';
END

PRINT '';
PRINT '✅ Diagnóstico concluído!';
