-- ========================================
-- VALIDAR PEDIDOS DO DISTRIBUIDOR
-- ========================================
-- Este script ajuda a validar se os pedidos
-- estão sendo mostrados corretamente no
-- Dashboard do Distribuidor

-- ⚠️ IMPORTANTE: Certifique-se de estar usando o database correto!
USE allmoove;
GO

-- ========================================
-- 1. LISTAR PEDIDOS POR DISTRIBUIDOR
-- ========================================

-- Substitua o ID_DISTRIBUIDOR pelo valor do seu distribuidor de teste
DECLARE @ID_DISTRIBUIDOR INT = 2; -- ⚠️ ALTERE AQUI!

SELECT
    P.ID as ID_PEDIDO,
    P.ID_DISTRIBUIDOR,
    P.ID_PESSOA as ID_ASSISTENCIA,
    PESSOA_ASS.NOME as NOME_ASSISTENCIA,
    P.STATUS,
    P.DATA_HORA_CRICAO_REGISTRO as DATA_PEDIDO,
    P.VALOR_FRETE,
    (
        -- Calcula valor total dos produtos
        SELECT ISNULL(SUM(PI.PRECO * PI.QUANTIDADE - ISNULL(PI.DESCONTO, 0)), 0)
        FROM PEDIDO_ITEM PI
        WHERE PI.ID_PEDIDO = P.ID
    ) as VALOR_PRODUTOS,
    (
        -- Conta quantidade de items
        SELECT COUNT(*)
        FROM PEDIDO_ITEM PI
        WHERE PI.ID_PEDIDO = P.ID
    ) as QTD_ITEMS,
    (
        -- Total pago (produtos + frete)
        SELECT ISNULL(SUM(PI.PRECO * PI.QUANTIDADE - ISNULL(PI.DESCONTO, 0)), 0) + P.VALOR_FRETE
        FROM dbo.PEDIDO_ITEM PI
        WHERE PI.ID_PEDIDO = P.ID
    ) as TOTAL_PAGO
FROM dbo.PEDIDO P
LEFT JOIN dbo.PESSOA PESSOA_ASS ON P.ID_PESSOA = PESSOA_ASS.ID
WHERE P.ID_DISTRIBUIDOR = @ID_DISTRIBUIDOR
ORDER BY P.DATA_HORA_CRICAO_REGISTRO DESC;

-- ========================================
-- 2. RESUMO DE PEDIDOS POR STATUS
-- ========================================

-- Mostra quantos pedidos existem em cada status para este distribuidor
SELECT
    P.STATUS,
    COUNT(*) as QUANTIDADE,
    SUM(
        (
            SELECT ISNULL(SUM(PI.PRECO * PI.QUANTIDADE - ISNULL(PI.DESCONTO, 0)), 0) + P.VALOR_FRETE
            FROM dbo.PEDIDO_ITEM PI
            WHERE PI.ID_PEDIDO = P.ID
        )
    ) as VALOR_TOTAL
FROM dbo.PEDIDO P
WHERE P.ID_DISTRIBUIDOR = @ID_DISTRIBUIDOR
GROUP BY P.STATUS
ORDER BY QUANTIDADE DESC;

-- ========================================
-- 3. VERIFICAR ITEMS DE UM PEDIDO ESPECÍFICO
-- ========================================

-- Substitua o ID_PEDIDO pelo pedido que você quer verificar
DECLARE @ID_PEDIDO INT = 101; -- ⚠️ ALTERE AQUI!

SELECT
    PI.ID as ID_ITEM,
    PI.ID_PEDIDO,
    PI.ID_PRODUTO,
    PROD.NOME as NOME_PRODUTO,
    PI.QUANTIDADE,
    PI.PRECO,
    ISNULL(PI.DESCONTO, 0) as DESCONTO,
    (PI.PRECO * PI.QUANTIDADE - ISNULL(PI.DESCONTO, 0)) as SUBTOTAL,
    PROD.ID_SEGMENTO,
    SEG.NOME as CATEGORIA
FROM dbo.PEDIDO_ITEM PI
INNER JOIN dbo.PRODUTO PROD ON PI.ID_PRODUTO = PROD.ID
LEFT JOIN dbo.PRODUTO_SEGMENTO SEG ON PROD.ID_SEGMENTO = SEG.ID
WHERE PI.ID_PEDIDO = @ID_PEDIDO;

-- ========================================
-- 4. COMPARAR PEDIDOS DE DIFERENTES DISTRIBUIDORES
-- ========================================

-- Mostra quantos pedidos cada distribuidor tem
SELECT
    P_DIST.ID as ID_DISTRIBUIDOR,
    P_DIST.NOME as NOME_DISTRIBUIDOR,
    COUNT(PED.ID) as TOTAL_PEDIDOS,
    SUM(CASE WHEN PED.STATUS = 'Aguardando Aceite' THEN 1 ELSE 0 END) as NOVOS,
    SUM(CASE WHEN PED.STATUS IN ('Aceito', 'Em Separação', 'Aguardando Retirada', 'Em Trânsito') THEN 1 ELSE 0 END) as EM_ANDAMENTO,
    SUM(CASE WHEN PED.STATUS IN ('Entregue ao Cliente', 'Concluído') THEN 1 ELSE 0 END) as CONCLUIDOS
FROM dbo.PESSOA P_DIST
LEFT JOIN dbo.PEDIDO PED ON PED.ID_DISTRIBUIDOR = P_DIST.ID
WHERE P_DIST.TIPO = 'DISTRIBUIDOR'
  AND P_DIST.SITUACAO_REGISTRO = 'ATIVO'
GROUP BY P_DIST.ID, P_DIST.NOME
ORDER BY TOTAL_PEDIDOS DESC;

-- ========================================
-- 5. CRIAR PEDIDOS DE TESTE PARA DISTRIBUIDOR
-- ========================================

/*
Use este script para criar pedidos de teste para validar o dashboard.

IMPORTANTE:
- Substitua @ID_DISTRIBUIDOR pelo ID do seu distribuidor de teste
- Substitua @ID_ASSISTENCIA pelo ID de uma assistência técnica válida
- Certifique-se que os produtos existem na tabela PRODUTO
*/

-- Descomente as linhas abaixo para executar:

-- DECLARE @ID_DISTRIBUIDOR_TESTE INT = 2;
-- DECLARE @ID_ASSISTENCIA_TESTE INT = 1;
-- DECLARE @ID_GRUPO_PEDIDO INT = 27;
--
-- -- Pedido 1: Aguardando Aceite
-- INSERT INTO dbo.PEDIDO (
--     EMPRESA, ESTABELECIMENTO, ID_GRUPO_PEDIDO, ID_PESSOA,
--     ID_DISTRIBUIDOR, VALOR_FRETE, STATUS, DATA_PEDIDO,
--     DATA_HORA_CRICAO_REGISTRO, USUARIO_CRIACAO, SITUACAO_REGISTRO
-- )
-- VALUES (
--     1, 1, @ID_GRUPO_PEDIDO, @ID_ASSISTENCIA_TESTE,
--     @ID_DISTRIBUIDOR_TESTE, 15.00, 'Aguardando Aceite', GETDATE(),
--     GETDATE(), 'TESTE', 'ATIVO'
-- );
--
-- DECLARE @ID_PEDIDO_1 INT = SCOPE_IDENTITY();
--
-- -- Items do Pedido 1
-- INSERT INTO dbo.PEDIDO_ITEM (
--     EMPRESA, ESTABELECIMENTO, ID_PEDIDO, ID_PRODUTO,
--     QUANTIDADE, PRECO, DATA_HORA_CRICAO_REGISTRO,
--     USUARIO_CRIACAO, SITUACAO_REGISTRO
-- )
-- VALUES
--     (1, 1, @ID_PEDIDO_1, 1, 2, 150.00, GETDATE(), 'TESTE', 'ATIVO'),
--     (1, 1, @ID_PEDIDO_1, 2, 5, 100.00, GETDATE(), 'TESTE', 'ATIVO');
--
-- -- Pedido 2: Aceito
-- INSERT INTO dbo.PEDIDO (
--     EMPRESA, ESTABELECIMENTO, ID_GRUPO_PEDIDO, ID_PESSOA,
--     ID_DISTRIBUIDOR, VALOR_FRETE, STATUS, DATA_PEDIDO,
--     DATA_HORA_CRICAO_REGISTRO, USUARIO_CRIACAO, SITUACAO_REGISTRO
-- )
-- VALUES (
--     1, 1, @ID_GRUPO_PEDIDO, @ID_ASSISTENCIA_TESTE,
--     @ID_DISTRIBUIDOR_TESTE, 20.00, 'Aceito', GETDATE(),
--     GETDATE(), 'TESTE', 'ATIVO'
-- );
--
-- DECLARE @ID_PEDIDO_2 INT = SCOPE_IDENTITY();
--
-- -- Items do Pedido 2
-- INSERT INTO dbo.PEDIDO_ITEM (
--     EMPRESA, ESTABELECIMENTO, ID_PEDIDO, ID_PRODUTO,
--     QUANTIDADE, PRECO, DATA_HORA_CRICAO_REGISTRO,
--     USUARIO_CRIACAO, SITUACAO_REGISTRO
-- )
-- VALUES
--     (1, 1, @ID_PEDIDO_2, 3, 1, 300.00, GETDATE(), 'TESTE', 'ATIVO');
--
-- PRINT '✅ Pedidos de teste criados!';
-- PRINT 'Pedido 1 (Aguardando Aceite): ' + CAST(@ID_PEDIDO_1 AS VARCHAR);
-- PRINT 'Pedido 2 (Aceito): ' + CAST(@ID_PEDIDO_2 AS VARCHAR);

-- ========================================
-- 6. VERIFICAR SE DISTRIBUIDOR EXISTE
-- ========================================

-- Verifica se o distribuidor está configurado corretamente
SELECT
    P.ID as ID_DISTRIBUIDOR,
    P.NOME,
    P.LOGIN,
    P.CPFCNPJ,
    P.TIPO,
    P.SITUACAO_REGISTRO
FROM dbo.PESSOA P
WHERE P.ID = @ID_DISTRIBUIDOR
  AND P.TIPO = 'DISTRIBUIDOR';

-- Se não retornar nada, o distribuidor não existe!

-- ========================================
-- 7. LIMPAR PEDIDOS DE TESTE (CUIDADO!)
-- ========================================

/*
⚠️ ATENÇÃO: Esta query REMOVE pedidos de teste!
Só execute se tiver certeza que quer remover os pedidos criados.

Descomente para executar:

-- DELETE FROM dbo.PEDIDO_ITEM WHERE ID_PEDIDO IN (
--     SELECT ID FROM dbo.PEDIDO WHERE ID_DISTRIBUIDOR = @ID_DISTRIBUIDOR
-- );
--
-- DELETE FROM dbo.PEDIDO WHERE ID_DISTRIBUIDOR = @ID_DISTRIBUIDOR;
--
-- PRINT '🗑️ Pedidos de teste removidos!';
*/
