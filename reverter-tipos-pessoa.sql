-- ============================================
-- REVERTER TIPOS DE PESSOA PARA O ESTADO ORIGINAL
-- ============================================
-- Este script desfaz as alterações de corrigir-tipos-pessoa.sql
-- ============================================

USE allmoove;
GO

PRINT '=== REVERTENDO PARA ESTADO ORIGINAL ==='
PRINT ''

-- Ver estado ATUAL
SELECT Tipo, COUNT(*) as Quantidade
FROM PESSOA
GROUP BY Tipo
ORDER BY Tipo;
GO

PRINT ''
PRINT 'Revertendo...'
PRINT ''

-- 1. Reverter ASSISTENCIA_TECNICA → FÍSICA (IDs 1-10)
UPDATE PESSOA
SET Tipo = 'FÍSICA'
WHERE Id BETWEEN 1 AND 10;
PRINT 'Revertido IDs 1-10 → FÍSICA'
GO

-- 2. Reverter DISTRIBUIDOR → JURÍDICA (IDs 11-16, mantendo ID 17)
UPDATE PESSOA
SET Tipo = 'JURÍDICA'
WHERE Id BETWEEN 11 AND 16;
PRINT 'Revertido IDs 11-16 → JURÍDICA'
GO

-- 3. Manter ID 17 como DISTRIBUIDOR
PRINT 'Mantido ID 17 → DISTRIBUIDOR'
GO

-- Ver estado FINAL
PRINT ''
PRINT '=== ESTADO FINAL (REVERTIDO) ==='
PRINT ''
SELECT Tipo, COUNT(*) as Quantidade
FROM PESSOA
GROUP BY Tipo
ORDER BY Tipo;
GO

PRINT ''
PRINT '=== REVERSÃO CONCLUÍDA! ==='
GO
