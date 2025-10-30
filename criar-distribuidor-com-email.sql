-- ========================================
-- CRIAR DISTRIBUIDOR COM EMAIL PARA LOGIN
-- ========================================
-- Este script atualiza o distribuidor "TechParts SP"
-- para usar email como login (ao invés de username)

USE allmoove;
GO

PRINT '🔧 CONFIGURANDO DISTRIBUIDOR COM EMAIL';
PRINT '========================================';
PRINT '';

-- ========================================
-- 1. VERIFICAR DISTRIBUIDOR EXISTENTE
-- ========================================
PRINT '1️⃣ Verificando distribuidor TechParts SP (ID: 20)...';
PRINT '';

SELECT
    ID,
    NOME,
    LOGIN,
    TIPO,
    CPFCNPJ,
    SITUACAO_REGISTRO
FROM dbo.PESSOA
WHERE ID = 20;

PRINT '';

-- ========================================
-- 2. ATUALIZAR LOGIN PARA EMAIL
-- ========================================
PRINT '2️⃣ Atualizando login para email...';
PRINT '';

UPDATE dbo.PESSOA
SET LOGIN = 'techparts@allmoove.com'
WHERE ID = 20
  AND TIPO = 'DISTRIBUIDOR';

PRINT '✅ Login atualizado para: techparts@allmoove.com';
PRINT '';

-- ========================================
-- 3. VERIFICAR ATUALIZAÇÃO
-- ========================================
PRINT '3️⃣ Verificando atualização...';
PRINT '';

SELECT
    ID,
    NOME,
    LOGIN,
    SENHA,
    TIPO,
    SITUACAO_REGISTRO
FROM dbo.PESSOA
WHERE ID = 20;

PRINT '';
PRINT '========================================';
PRINT '✅ DISTRIBUIDOR CONFIGURADO!';
PRINT '========================================';
PRINT '';
PRINT 'Credenciais de acesso:';
PRINT '';
PRINT '📧 Email: techparts@allmoove.com';
PRINT '🔑 Senha: 123456';
PRINT '';
PRINT 'Use estas credenciais para fazer login no sistema.';
PRINT '';

-- ========================================
-- 4. ATUALIZAR OUTROS DISTRIBUIDORES (OPCIONAL)
-- ========================================
PRINT '4️⃣ Atualizando outros distribuidores...';
PRINT '';

-- Global Peças RJ (ID: 21)
UPDATE dbo.PESSOA
SET LOGIN = 'globalpecas@allmoove.com'
WHERE ID = 21
  AND TIPO = 'DISTRIBUIDOR';

-- ImportaCell (ID: 22)
UPDATE dbo.PESSOA
SET LOGIN = 'importacell@allmoove.com'
WHERE ID = 22
  AND TIPO = 'DISTRIBUIDOR';

-- Display Brasil (ID: 23)
UPDATE dbo.PESSOA
SET LOGIN = 'displaybr@allmoove.com'
WHERE ID = 23
  AND TIPO = 'DISTRIBUIDOR';

PRINT '✅ Todos os distribuidores atualizados!';
PRINT '';

-- ========================================
-- 5. LISTA FINAL DE DISTRIBUIDORES
-- ========================================
PRINT '5️⃣ Lista de distribuidores com emails:';
PRINT '';

SELECT
    ID,
    NOME,
    LOGIN as EMAIL,
    SENHA,
    TIPO
FROM dbo.PESSOA
WHERE TIPO = 'DISTRIBUIDOR'
  AND ID IN (20, 21, 22, 23)
ORDER BY ID;

PRINT '';
PRINT '========================================';
PRINT '📋 RESUMO DAS CREDENCIAIS';
PRINT '========================================';
PRINT '';
PRINT 'TechParts SP:';
PRINT '  Email: techparts@allmoove.com';
PRINT '  Senha: 123456';
PRINT '';
PRINT 'Global Peças RJ:';
PRINT '  Email: globalpecas@allmoove.com';
PRINT '  Senha: 123456';
PRINT '';
PRINT 'ImportaCell:';
PRINT '  Email: importacell@allmoove.com';
PRINT '  Senha: 123456';
PRINT '';
PRINT 'Display Brasil:';
PRINT '  Email: displaybr@allmoove.com';
PRINT '  Senha: 123456';
PRINT '';
PRINT '✅ Script concluído!';
