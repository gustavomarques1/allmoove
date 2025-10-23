-- ============================================
-- DIAGNÓSTICO COMPLETO DO SISTEMA DE ROLES
-- ============================================

USE allmoove;
GO

PRINT '=== 1. DISTRIBUIÇÃO DE TIPOS ==='
PRINT ''
SELECT
    ISNULL(Tipo, 'NULL/VAZIO') as Tipo,
    COUNT(*) as Quantidade
FROM PESSOA
GROUP BY Tipo
ORDER BY COUNT(*) DESC;
GO

PRINT ''
PRINT '=== 2. EXEMPLOS DE CADA TIPO ==='
PRINT ''

-- Distribuidores
PRINT '--- DISTRIBUIDORES ---'
SELECT TOP 5
    Id,
    Nome,
    ISNULL(Login, 'N/A') as Login,
    Tipo
FROM PESSOA
WHERE Tipo = 'DISTRIBUIDOR'
ORDER BY Id;
GO

-- Assistências
PRINT ''
PRINT '--- ASSISTÊNCIAS TÉCNICAS ---'
SELECT TOP 5
    Id,
    Nome,
    ISNULL(Login, 'N/A') as Login,
    Tipo
FROM PESSOA
WHERE Tipo = 'ASSISTENCIA_TECNICA'
ORDER BY Id;
GO

-- Entregadores
PRINT ''
PRINT '--- ENTREGADORES ---'
SELECT TOP 5
    Id,
    Nome,
    ISNULL(Login, 'N/A') as Login,
    Tipo
FROM PESSOA
WHERE Tipo = 'ENTREGADOR'
ORDER BY Id;
GO

-- Sem tipo
PRINT ''
PRINT '--- SEM TIPO DEFINIDO (serão tratados como ASSISTENCIA_TECNICA) ---'
SELECT TOP 5
    Id,
    Nome,
    ISNULL(Login, 'N/A') as Login,
    ISNULL(Tipo, 'NULL') as Tipo
FROM PESSOA
WHERE Tipo IS NULL OR Tipo = ''
ORDER BY Id;
GO

PRINT ''
PRINT '=== 3. SUGESTÃO DE COMANDO PARA CRIAR DISTRIBUIDOR DE TESTE ==='
PRINT ''
PRINT '-- Execute este comando para transformar a pessoa ID=2 em distribuidor:'
PRINT 'UPDATE PESSOA SET Tipo = ''DISTRIBUIDOR'' WHERE Id = 2;'
PRINT ''
PRINT '-- Depois verifique:'
PRINT 'SELECT Id, Nome, Login, Tipo FROM PESSOA WHERE Id = 2;'
GO
