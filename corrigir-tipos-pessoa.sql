-- ============================================
-- CORREÇÃO DOS TIPOS DE PESSOA
-- ============================================
-- Este script ajusta os tipos para os valores esperados pelo frontend
--
-- ANTES DE EXECUTAR:
-- 1. Revise os comandos abaixo
-- 2. Se concordar, execute TUDO de uma vez
-- 3. Caso queira reverter, execute o script: reverter-tipos-pessoa.sql
--
-- ============================================

USE allmoove;
GO

-- Ver estado ATUAL (antes das mudanças)
PRINT '=== ESTADO ATUAL (ANTES) ==='
PRINT ''
SELECT Tipo, COUNT(*) as Quantidade
FROM PESSOA
GROUP BY Tipo
ORDER BY Tipo;
GO

PRINT ''
PRINT '=== EXECUTANDO CORREÇÕES ==='
PRINT ''

-- 1. Converter FÍSICA → ASSISTENCIA_TECNICA
-- Pessoas físicas são assistências técnicas que fazem pedidos
UPDATE PESSOA
SET Tipo = 'ASSISTENCIA_TECNICA'
WHERE Tipo = 'FÍSICA';
PRINT 'Convertido FÍSICA → ASSISTENCIA_TECNICA'
GO

-- 2. Converter JURÍDICA → DISTRIBUIDOR
-- Pessoas jurídicas são distribuidores que gerenciam estoque
UPDATE PESSOA
SET Tipo = 'DISTRIBUIDOR'
WHERE Tipo = 'JURÍDICA';
PRINT 'Convertido JURÍDICA → DISTRIBUIDOR'
GO

-- 3. Manter DISTRIBUIDOR como está
-- ID 17 já está correto
PRINT 'Mantido DISTRIBUIDOR sem alterações'
GO

-- Ver estado FINAL (depois das mudanças)
PRINT ''
PRINT '=== ESTADO FINAL (DEPOIS) ==='
PRINT ''
SELECT Tipo, COUNT(*) as Quantidade
FROM PESSOA
GROUP BY Tipo
ORDER BY Tipo;
GO

-- Mostrar exemplos de cada tipo
PRINT ''
PRINT '=== EXEMPLOS DE CADA TIPO ==='
PRINT ''

PRINT '--- ASSISTÊNCIAS TÉCNICAS (eram FÍSICA) ---'
SELECT TOP 5 Id, Nome, Login, Tipo
FROM PESSOA
WHERE Tipo = 'ASSISTENCIA_TECNICA'
ORDER BY Id;
GO

PRINT ''
PRINT '--- DISTRIBUIDORES (eram JURÍDICA + ID 17) ---'
SELECT Id, Nome, Login, Tipo
FROM PESSOA
WHERE Tipo = 'DISTRIBUIDOR'
ORDER BY Id;
GO

PRINT ''
PRINT '=== CORREÇÃO CONCLUÍDA! ==='
PRINT ''
PRINT 'Agora você pode testar:'
PRINT '1. Login como ASSISTÊNCIA: Login = "ldbinfo" (IDs 1-10)'
PRINT '   → Será redirecionado para /assistencia/dashboard'
PRINT ''
PRINT '2. Login como DISTRIBUIDOR: Login = "distribuidor" (ID 17)'
PRINT '   → Será redirecionado para /distribuidor/dashboard'
PRINT ''
PRINT 'Ou login com qualquer dos distribuidores IDs 11-17'
GO
