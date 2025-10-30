-- ========================================
-- VERIFICAR LOGIN DO DISTRIBUIDOR
-- ========================================
-- Valida se o email foi atualizado corretamente

USE allmoove;
GO

PRINT '🔍 VERIFICANDO LOGIN DO DISTRIBUIDOR';
PRINT '========================================';
PRINT '';

-- ========================================
-- 1. VERIFICAR DISTRIBUIDOR ID 20
-- ========================================
PRINT '1️⃣ Dados do TechParts SP (ID: 20):';
PRINT '';

SELECT
    ID,
    NOME,
    LOGIN,
    SENHA,
    TIPO,
    CPFCNPJ,
    SITUACAO,
    SITUACAO_REGISTRO,
    LEN(LOGIN) as TAMANHO_LOGIN,
    LEN(SENHA) as TAMANHO_SENHA
FROM dbo.PESSOA
WHERE ID = 20;

PRINT '';

-- ========================================
-- 2. BUSCAR POR LOGIN (COMO A API FAZ)
-- ========================================
PRINT '2️⃣ Buscando por login "tech@allmoove.com":';
PRINT '';

SELECT
    ID,
    NOME,
    LOGIN,
    SENHA,
    TIPO,
    SITUACAO_REGISTRO
FROM dbo.PESSOA
WHERE LOGIN = 'tech@allmoove.com';

PRINT '';

-- ========================================
-- 3. VERIFICAR TODOS OS DISTRIBUIDORES
-- ========================================
PRINT '3️⃣ Todos os distribuidores:';
PRINT '';

SELECT
    ID,
    NOME,
    LOGIN,
    SENHA,
    TIPO,
    SITUACAO_REGISTRO
FROM dbo.PESSOA
WHERE TIPO = 'DISTRIBUIDOR'
ORDER BY ID;

PRINT '';

-- ========================================
-- 4. TESTAR CREDENCIAIS MANUALMENTE
-- ========================================
PRINT '4️⃣ Testando credenciais (simulando API):';
PRINT '';

DECLARE @login VARCHAR(50) = 'tech@allmoove.com';
DECLARE @senha VARCHAR(50) = '123456';

IF EXISTS (
    SELECT 1
    FROM dbo.PESSOA
    WHERE LOGIN = @login
      AND SENHA = @senha
      AND SITUACAO_REGISTRO = 'ATIVO'
)
BEGIN
    PRINT '✅ CREDENCIAIS VÁLIDAS!';
    PRINT '';

    SELECT
        ID,
        NOME,
        LOGIN,
        TIPO,
        SITUACAO_REGISTRO
    FROM dbo.PESSOA
    WHERE LOGIN = @login
      AND SENHA = @senha;
END
ELSE
BEGIN
    PRINT '❌ CREDENCIAIS INVÁLIDAS!';
    PRINT '';
    PRINT 'Verificando problemas:';

    IF NOT EXISTS (SELECT 1 FROM dbo.PESSOA WHERE LOGIN = @login)
        PRINT '  ❌ Login não encontrado';
    ELSE IF NOT EXISTS (SELECT 1 FROM dbo.PESSOA WHERE LOGIN = @login AND SENHA = @senha)
        PRINT '  ❌ Senha incorreta';
    ELSE IF NOT EXISTS (SELECT 1 FROM dbo.PESSOA WHERE LOGIN = @login AND SITUACAO_REGISTRO = 'ATIVO')
        PRINT '  ❌ Usuário inativo';
END

PRINT '';
PRINT '========================================';
PRINT '✅ Verificação concluída!';
