-- ========================================
-- VERIFICAR TABELA ASPNETUSERS
-- ========================================
-- ASP.NET Identity armazena usuários em tabelas separadas

USE allmoove;
GO

PRINT '🔍 VERIFICANDO ASPNETUSERS';
PRINT '========================================';
PRINT '';

-- ========================================
-- 1. VERIFICAR SE TABELA EXISTE
-- ========================================
PRINT '1️⃣ Verificando se tabela AspNetUsers existe...';
PRINT '';

IF OBJECT_ID('dbo.AspNetUsers', 'U') IS NOT NULL
BEGIN
    PRINT '✅ Tabela AspNetUsers existe!';
    PRINT '';

    -- Mostra estrutura da tabela
    PRINT '📋 Colunas da tabela AspNetUsers:';
    SELECT
        COLUMN_NAME,
        DATA_TYPE,
        CHARACTER_MAXIMUM_LENGTH
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'AspNetUsers'
    ORDER BY ORDINAL_POSITION;

    PRINT '';
END
ELSE
BEGIN
    PRINT '❌ Tabela AspNetUsers NÃO EXISTE!';
    PRINT '';
    PRINT '⚠️ O sistema usa autenticação diferente.';
    PRINT '   Verifique o método de autenticação no backend.';
    PRINT '';
END

-- ========================================
-- 2. LISTAR USUÁRIOS EXISTENTES
-- ========================================
IF OBJECT_ID('dbo.AspNetUsers', 'U') IS NOT NULL
BEGIN
    PRINT '2️⃣ Usuários cadastrados no AspNetUsers:';
    PRINT '';

    SELECT
        Id,
        UserName,
        Email,
        EmailConfirmed,
        PhoneNumber,
        LockoutEnabled
    FROM dbo.AspNetUsers;

    PRINT '';
END

-- ========================================
-- 3. BUSCAR DISTRIBUIDOR NO ASPNETUSERS
-- ========================================
IF OBJECT_ID('dbo.AspNetUsers', 'U') IS NOT NULL
BEGIN
    PRINT '3️⃣ Buscando distribuidor tech@allmoove.com:';
    PRINT '';

    IF EXISTS (SELECT 1 FROM dbo.AspNetUsers WHERE Email = 'tech@allmoove.com' OR UserName = 'tech@allmoove.com')
    BEGIN
        PRINT '✅ Usuário encontrado no AspNetUsers!';
        PRINT '';

        SELECT
            Id,
            UserName,
            Email,
            EmailConfirmed
        FROM dbo.AspNetUsers
        WHERE Email = 'tech@allmoove.com'
           OR UserName = 'tech@allmoove.com';
    END
    ELSE
    BEGIN
        PRINT '❌ Usuário NÃO encontrado no AspNetUsers!';
        PRINT '';
        PRINT '⚠️ O usuário existe na tabela PESSOA mas não no AspNetUsers.';
        PRINT '   Você precisa criar o usuário via API /api/account/CreateUser';
        PRINT '   ou adicionar manualmente no AspNetUsers.';
        PRINT '';
    END

    PRINT '';
END

-- ========================================
-- 4. COMPARAR PESSOA vs ASPNETUSERS
-- ========================================
PRINT '4️⃣ Comparação PESSOA vs AspNetUsers:';
PRINT '';

IF OBJECT_ID('dbo.AspNetUsers', 'U') IS NOT NULL
BEGIN
    -- Usuários na PESSOA
    DECLARE @pessoaCount INT;
    SELECT @pessoaCount = COUNT(*) FROM dbo.PESSOA WHERE TIPO = 'DISTRIBUIDOR';
    PRINT 'Distribuidores na tabela PESSOA: ' + CAST(@pessoaCount AS VARCHAR);

    -- Usuários no AspNetUsers
    DECLARE @aspnetCount INT;
    SELECT @aspnetCount = COUNT(*) FROM dbo.AspNetUsers;
    PRINT 'Usuários na tabela AspNetUsers: ' + CAST(@aspnetCount AS VARCHAR);
    PRINT '';

    -- Mostra distribuidores que NÃO estão no AspNetUsers
    PRINT 'Distribuidores que NÃO estão no AspNetUsers:';
    PRINT '';

    SELECT
        P.ID,
        P.NOME,
        P.LOGIN,
        P.TIPO
    FROM dbo.PESSOA P
    WHERE P.TIPO = 'DISTRIBUIDOR'
      AND NOT EXISTS (
          SELECT 1
          FROM dbo.AspNetUsers A
          WHERE A.Email = P.LOGIN
             OR A.UserName = P.LOGIN
      );

    PRINT '';
END

PRINT '========================================';
PRINT '📋 RESUMO';
PRINT '========================================';
PRINT '';
PRINT 'O sistema AllMoove usa ASP.NET Identity para autenticação.';
PRINT '';
PRINT 'Para fazer login, o usuário precisa existir em:';
PRINT '1. AspNetUsers (para autenticação)';
PRINT '2. PESSOA (para dados do distribuidor)';
PRINT '';
PRINT 'Se o usuário não está no AspNetUsers, você tem 2 opções:';
PRINT '';
PRINT 'OPÇÃO 1 - Via API (recomendado):';
PRINT 'POST /api/account/CreateUser';
PRINT '{';
PRINT '  "email": "tech@allmoove.com",';
PRINT '  "password": "123456",';
PRINT '  "confirmPassword": "123456"';
PRINT '}';
PRINT '';
PRINT 'OPÇÃO 2 - Login com usuário existente:';
PRINT 'Use um email que já existe no AspNetUsers';
PRINT '';
PRINT '✅ Verificação concluída!';
