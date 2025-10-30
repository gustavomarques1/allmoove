-- ========================================
-- VALIDAR VINCULAÇÃO FORNECEDOR → DISTRIBUIDOR
-- ========================================
-- Execute este script DEPOIS de fazer um pedido
-- para validar que a vinculação está funcionando

USE allmoove;
GO

PRINT '🔍 VALIDANDO VINCULAÇÃO FORNECEDOR → DISTRIBUIDOR';
PRINT '========================================';
PRINT '';

-- ========================================
-- 1. LISTAR DISTRIBUIDORES CADASTRADOS
-- ========================================
PRINT '1️⃣ Distribuidores cadastrados no sistema:';
PRINT '';

SELECT
    ID,
    NOME,
    TIPO,
    LOGIN,
    SITUACAO_REGISTRO
FROM dbo.PESSOA
WHERE TIPO = 'DISTRIBUIDOR'
  AND (SITUACAO_REGISTRO = 'ATIVO' OR SITUACAO_REGISTRO IS NULL)
ORDER BY ID;

PRINT '';
PRINT '⚠️ IMPORTANTE: Os NOMES acima devem ser EXATAMENTE iguais aos';
PRINT '   fornecedores usados nos produtos (ex: "TechParts SP")';
PRINT '';

-- ========================================
-- 2. VERIFICAR ÚLTIMOS PEDIDOS CRIADOS
-- ========================================
PRINT '2️⃣ Últimos 10 pedidos criados:';
PRINT '';

SELECT TOP 10
    P.ID as ID_PEDIDO,
    P.ID_PESSOA as ID_ASSISTENCIA,
    PESSOA_ASS.NOME as ASSISTENCIA,
    P.ID_DISTRIBUIDOR,
    PESSOA_DIST.NOME as DISTRIBUIDOR,
    P.STATUS,
    P.VALOR_FRETE,
    P.DATA_HORA_CRICAO_REGISTRO as DATA_CRIACAO
FROM dbo.PEDIDO P
LEFT JOIN dbo.PESSOA PESSOA_ASS ON P.ID_PESSOA = PESSOA_ASS.ID
LEFT JOIN dbo.PESSOA PESSOA_DIST ON P.ID_DISTRIBUIDOR = PESSOA_DIST.ID
ORDER BY P.ID DESC;

PRINT '';

-- ========================================
-- 3. VERIFICAR PEDIDOS COM/SEM DISTRIBUIDOR
-- ========================================
PRINT '3️⃣ Estatísticas de vinculação:';
PRINT '';

DECLARE @totalPedidos INT;
DECLARE @pedidosComDistribuidor INT;
DECLARE @pedidosSemDistribuidor INT;

SELECT @totalPedidos = COUNT(*) FROM dbo.PEDIDO;
SELECT @pedidosComDistribuidor = COUNT(*) FROM dbo.PEDIDO WHERE ID_DISTRIBUIDOR IS NOT NULL;
SELECT @pedidosSemDistribuidor = COUNT(*) FROM dbo.PEDIDO WHERE ID_DISTRIBUIDOR IS NULL;

PRINT 'Total de pedidos: ' + CAST(@totalPedidos AS VARCHAR);
PRINT 'Pedidos COM distribuidor: ' + CAST(@pedidosComDistribuidor AS VARCHAR) + ' ✅';
PRINT 'Pedidos SEM distribuidor: ' + CAST(@pedidosSemDistribuidor AS VARCHAR) +
      CASE WHEN @pedidosSemDistribuidor > 0 THEN ' ⚠️' ELSE '' END;
PRINT '';

IF @pedidosSemDistribuidor > 0
BEGIN
    PRINT '⚠️ ATENÇÃO: Existem pedidos sem distribuidor vinculado!';
    PRINT '';
    PRINT '   Estes pedidos NÃO aparecerão no dashboard dos distribuidores.';
    PRINT '';
    PRINT '   Possíveis causas:';
    PRINT '   1. Nome do fornecedor no produto não corresponde a nenhum distribuidor';
    PRINT '   2. Pedidos criados antes da implementação da vinculação';
    PRINT '';
END

-- ========================================
-- 4. MOSTRAR PEDIDOS SEM DISTRIBUIDOR (se houver)
-- ========================================
IF @pedidosSemDistribuidor > 0
BEGIN
    PRINT '4️⃣ Pedidos SEM distribuidor vinculado:';
    PRINT '';

    SELECT TOP 10
        P.ID as ID_PEDIDO,
        P.ID_PESSOA as ID_ASSISTENCIA,
        PESSOA_ASS.NOME as ASSISTENCIA,
        P.STATUS,
        P.DATA_HORA_CRICAO_REGISTRO as DATA_CRIACAO,
        '❌ SEM DISTRIBUIDOR' as OBSERVACAO
    FROM dbo.PEDIDO P
    LEFT JOIN dbo.PESSOA PESSOA_ASS ON P.ID_PESSOA = PESSOA_ASS.ID
    WHERE P.ID_DISTRIBUIDOR IS NULL
    ORDER BY P.ID DESC;

    PRINT '';
END

-- ========================================
-- 5. PEDIDOS POR DISTRIBUIDOR
-- ========================================
PRINT '5️⃣ Pedidos agrupados por distribuidor:';
PRINT '';

SELECT
    ISNULL(PESSOA_DIST.NOME, '❌ SEM DISTRIBUIDOR') as DISTRIBUIDOR,
    COUNT(*) as TOTAL_PEDIDOS,
    SUM(CASE WHEN P.STATUS = 'ATIVO' THEN 1 ELSE 0 END) as ATIVOS,
    SUM(CASE WHEN P.STATUS = 'Aguardando Aceite' THEN 1 ELSE 0 END) as AGUARDANDO_ACEITE,
    SUM(CASE WHEN P.STATUS IN ('Entregue', 'Concluído') THEN 1 ELSE 0 END) as FINALIZADOS
FROM dbo.PEDIDO P
LEFT JOIN dbo.PESSOA PESSOA_DIST ON P.ID_DISTRIBUIDOR = PESSOA_DIST.ID
GROUP BY PESSOA_DIST.NOME
ORDER BY TOTAL_PEDIDOS DESC;

PRINT '';

-- ========================================
-- 6. TESTAR BUSCA POR NOME (API)
-- ========================================
PRINT '6️⃣ Testando busca de distribuidor por nome (simulação da API):';
PRINT '';

-- Lista de fornecedores usados nos produtos
DECLARE @fornecedores TABLE (Nome VARCHAR(100));
INSERT INTO @fornecedores VALUES
    ('TechParts SP'),
    ('Global Peças RJ'),
    ('ImportaCell'),
    ('Display Brasil');

-- Para cada fornecedor, tenta encontrar o distribuidor
DECLARE @fornecedor VARCHAR(100);
DECLARE cur CURSOR FOR SELECT Nome FROM @fornecedores;

OPEN cur;
FETCH NEXT FROM cur INTO @fornecedor;

WHILE @@FETCH_STATUS = 0
BEGIN
    DECLARE @idDistribuidor BIGINT;

    SELECT TOP 1 @idDistribuidor = ID
    FROM dbo.PESSOA
    WHERE NOME = @fornecedor
      AND TIPO = 'DISTRIBUIDOR'
      AND (SITUACAO_REGISTRO = 'ATIVO' OR SITUACAO_REGISTRO IS NULL);

    IF @idDistribuidor IS NOT NULL
        PRINT '✅ "' + @fornecedor + '" → ID: ' + CAST(@idDistribuidor AS VARCHAR);
    ELSE
        PRINT '❌ "' + @fornecedor + '" → NÃO ENCONTRADO (precisa criar!)';

    SET @idDistribuidor = NULL;
    FETCH NEXT FROM cur INTO @fornecedor;
END

CLOSE cur;
DEALLOCATE cur;

PRINT '';

-- ========================================
-- 7. VERIFICAR ITENS DOS PEDIDOS
-- ========================================
PRINT '7️⃣ Verificando items dos últimos pedidos:';
PRINT '';

IF OBJECT_ID('dbo.PEDIDO_ITEM', 'U') IS NOT NULL
BEGIN
    SELECT TOP 10
        PI.ID as ID_ITEM,
        PI.ID_PEDIDO,
        P.ID_DISTRIBUIDOR,
        PESSOA_DIST.NOME as DISTRIBUIDOR,
        PI.NOME as PRODUTO,
        PI.QUANTIDADE,
        PI.PRECO
    FROM dbo.PEDIDO_ITEM PI
    INNER JOIN dbo.PEDIDO P ON PI.ID_PEDIDO = P.ID
    LEFT JOIN dbo.PESSOA PESSOA_DIST ON P.ID_DISTRIBUIDOR = PESSOA_DIST.ID
    ORDER BY PI.ID DESC;
END
ELSE
BEGIN
    PRINT '⚠️ Tabela PEDIDO_ITEM não encontrada';
END

PRINT '';

-- ========================================
-- 8. RESUMO FINAL
-- ========================================
PRINT '========================================';
PRINT '📊 RESUMO FINAL';
PRINT '========================================';
PRINT '';

IF @pedidosSemDistribuidor = 0 AND @totalPedidos > 0
BEGIN
    PRINT '✅ TUDO OK! Todos os pedidos estão vinculados a distribuidores.';
    PRINT '';
    PRINT '🎉 A integração está funcionando corretamente!';
    PRINT '';
END
ELSE IF @totalPedidos = 0
BEGIN
    PRINT '⚠️ NENHUM PEDIDO ENCONTRADO';
    PRINT '';
    PRINT '📝 Próximos passos:';
    PRINT '1. Fazer um pedido no frontend';
    PRINT '2. Executar este script novamente para validar';
    PRINT '';
END
ELSE
BEGIN
    PRINT '⚠️ ATENÇÃO: Alguns pedidos não têm distribuidor vinculado!';
    PRINT '';
    PRINT '📝 Ações necessárias:';
    PRINT '';
    PRINT '1. Verificar se os nomes dos distribuidores estão corretos:';
    PRINT '   - Nome no banco DEVE ser igual ao nome do fornecedor';
    PRINT '   - Ex: Se produto tem fornecedor="TechParts SP", deve existir';
    PRINT '        uma PESSOA com NOME="TechParts SP" e TIPO="DISTRIBUIDOR"';
    PRINT '';
    PRINT '2. Criar distribuidores faltantes:';
    PRINT '   Execute: criar-distribuidor-teste.sql';
    PRINT '';
    PRINT '3. Fazer novo pedido após criar distribuidores';
    PRINT '';
END

PRINT '✅ Validação concluída!';
PRINT '';
PRINT '📚 Para mais informações, leia:';
PRINT '   VINCULACAO_FORNECEDOR_DISTRIBUIDOR.md';
