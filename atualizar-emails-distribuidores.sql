-- ========================================
-- ATUALIZAR EMAILS DOS DISTRIBUIDORES
-- ========================================
-- Usa emails CURTOS que cabem em 20 caracteres

USE allmoove;
GO

PRINT '🔧 ATUALIZANDO EMAILS DOS DISTRIBUIDORES';
PRINT '========================================';
PRINT '';

-- ========================================
-- 1. ATUALIZAR LOGINS PARA EMAILS CURTOS
-- ========================================
PRINT '1️⃣ Atualizando logins para emails curtos...';
PRINT '';

-- TechParts SP (ID: 20)
UPDATE dbo.PESSOA
SET LOGIN = 'tech@allmoove.com'
WHERE ID = 20;

PRINT '✅ TechParts SP → tech@allmoove.com (17 chars)';

-- Global Peças RJ (ID: 21)
UPDATE dbo.PESSOA
SET LOGIN = 'global@allmoove.com'
WHERE ID = 21;

PRINT '✅ Global Peças RJ → global@allmoove.com (19 chars)';

-- ImportaCell (ID: 22)
UPDATE dbo.PESSOA
SET LOGIN = 'importa@allmoove.com'
WHERE ID = 22;

PRINT '✅ ImportaCell → importa@allmoove.com (20 chars)';

-- Display Brasil (ID: 23)
UPDATE dbo.PESSOA
SET LOGIN = 'display@allmoove.com'
WHERE ID = 23;

PRINT '✅ Display Brasil → display@allmoove.com (20 chars)';

PRINT '';

-- ========================================
-- 2. VERIFICAR ATUALIZAÇÕES
-- ========================================
PRINT '2️⃣ Verificando atualizações...';
PRINT '';

SELECT
    ID,
    NOME,
    LOGIN as EMAIL,
    SENHA,
    TIPO,
    LEN(LOGIN) as TAMANHO_EMAIL
FROM dbo.PESSOA
WHERE TIPO = 'DISTRIBUIDOR'
  AND ID IN (20, 21, 22, 23)
ORDER BY ID;

PRINT '';
PRINT '========================================';
PRINT '✅ EMAILS ATUALIZADOS COM SUCESSO!';
PRINT '========================================';
PRINT '';
PRINT '📋 CREDENCIAIS DE ACESSO:';
PRINT '';
PRINT '🏪 TechParts SP (tem pedido #90):';
PRINT '   Email: tech@allmoove.com';
PRINT '   Senha: 123456';
PRINT '';
PRINT '🏪 Global Peças RJ:';
PRINT '   Email: global@allmoove.com';
PRINT '   Senha: 123456';
PRINT '';
PRINT '🏪 ImportaCell:';
PRINT '   Email: importa@allmoove.com';
PRINT '   Senha: 123456';
PRINT '';
PRINT '🏪 Display Brasil:';
PRINT '   Email: display@allmoove.com';
PRINT '   Senha: 123456';
PRINT '';
PRINT '========================================';
PRINT '🎯 PRÓXIMO PASSO:';
PRINT '========================================';
PRINT '';
PRINT '1. Faça logout do sistema';
PRINT '2. Faça login com: tech@allmoove.com / 123456';
PRINT '3. Sistema deve redirecionar para /distribuidor/dashboard';
PRINT '4. O pedido #90 deve aparecer na lista!';
PRINT '';
PRINT '✅ Script concluído!';
