-- ========================================
-- POPULAR VIEW_DISTRIBUIDOR_CONSULTA com distribuidor ID 20
-- ========================================

USE allmoove;
GO

-- 1. Verificar estrutura da tabela que alimenta a VIEW
PRINT '🔍 Verificando se existe tabela VIEW_DISTRIBUIDOR_SEGMENTO:';
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'VIEW_DISTRIBUIDOR_SEGMENTO')
BEGIN
    SELECT * FROM dbo.VIEW_DISTRIBUIDOR_SEGMENTO;
END
ELSE IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'DISTRIBUIDOR_SEGMENTO')
BEGIN
    PRINT '📊 Tabela DISTRIBUIDOR_SEGMENTO encontrada:';
    SELECT * FROM dbo.DISTRIBUIDOR_SEGMENTO
    WHERE ID_DISTRIBUIDOR IN (2, 3, 4);

    -- Inserir segmentos para o distribuidor 4 (ID_PESSOA 20)
    PRINT '';
    PRINT '➕ Inserindo segmentos para distribuidor ID 4...';

    -- Verifica se já existem segmentos
    IF NOT EXISTS (SELECT 1 FROM dbo.DISTRIBUIDOR_SEGMENTO WHERE ID_DISTRIBUIDOR = 4)
    BEGIN
        -- Insere todos os 7 segmentos para o distribuidor 4
        INSERT INTO dbo.DISTRIBUIDOR_SEGMENTO (ID_DISTRIBUIDOR, ID_SEGMENTO)
        VALUES
            (4, 1), -- CELULAR
            (4, 2), -- AUTO
            (4, 3), -- MOTO
            (4, 4), -- ELETRO
            (4, 5), -- PAPELARIA
            (4, 7), -- ACESSÓRIOS
            (4, 9); -- PRODUTOS GOIANOS

        PRINT '✅ Segmentos inseridos com sucesso!';
    END
    ELSE
    BEGIN
        PRINT '⚠️ Distribuidor 4 já possui segmentos cadastrados';
    END

    PRINT '';
    PRINT '📊 Verificando resultado:';
    SELECT * FROM dbo.DISTRIBUIDOR_SEGMENTO
    WHERE ID_DISTRIBUIDOR = 4;
END
ELSE
BEGIN
    PRINT '⚠️ Tabela de relação distribuidor-segmento não encontrada';
END
GO

-- 2. Testar a VIEW novamente
PRINT '';
PRINT '🧪 Testando VIEW_DISTRIBUIDOR_CONSULTA após insert:';
GO

SELECT
    ID_DISTRIBUIDOR,
    ID_SEGMENTO,
    NOME,
    CPFCNPJ
FROM dbo.VIEW_DISTRIBUIDOR_CONSULTA
WHERE CPFCNPJ = '11111111111111'
   OR ID_DISTRIBUIDOR = 4
ORDER BY ID_DISTRIBUIDOR, ID_SEGMENTO;
GO

-- 3. Mostrar todos os distribuidores na VIEW
PRINT '';
PRINT '📊 Todos os distribuidores na VIEW:';
GO

SELECT DISTINCT
    ID_DISTRIBUIDOR,
    NOME,
    CPFCNPJ
FROM dbo.VIEW_DISTRIBUIDOR_CONSULTA
ORDER BY ID_DISTRIBUIDOR;
GO

PRINT '';
PRINT '✅ Script concluído!';
GO
