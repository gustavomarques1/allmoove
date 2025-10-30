-- ========================================
-- CORRIGIR VIEW PRODUTOS
-- ========================================

USE allmoove;
GO

-- 1. Dropar VIEW antiga (que está simplificando as colunas)
PRINT '🗑️ Removendo VIEW antiga...';
GO

IF OBJECT_ID('dbo.PRODUTOS', 'V') IS NOT NULL
    DROP VIEW dbo.PRODUTOS;
GO

-- 2. Criar VIEW correta com TODAS as colunas
PRINT '✅ Criando VIEW PRODUTOS atualizada...';
GO

CREATE VIEW dbo.PRODUTOS AS
SELECT
    ID,
    EMPRESA,
    ESTABELECIMENTO,
    CODIGO,
    DATA_HORA_CRICAO_REGISTRO,
    DATA_HORA_ALTERACAO_REGISTRO,
    USUARIO_CRIACAO,
    USUARIO_ALTERACAO,
    SITUACAO_REGISTRO,
    ID_DISTRIBUIDOR,
    ID_SEGMENTO,
    ID_MARCA,
    ID_MODELO,
    ID_GRUPO,
    ID_TAG,
    NOME,
    DESCRICAO,
    SKU,
    EAN,
    POSICAO,
    SITUACAO,
    PRECO_CUSTO,
    PRECO_VENDA_PIX,
    PRECO_VENDA_DEBITO,
    PRECO_VENDA_CREDITO,
    PRECO_VENDA_BOLETO,
    QUANTIDADE,
    QUANTIDADE_ESTOQUE_MINIMO,
    FRETE_GRATIS,
    IMAGEM
FROM dbo.PRODUTO;
GO

-- 3. Testar VIEW corrigida
PRINT '🧪 Testando VIEW corrigida...';
GO

SELECT
    ID,
    NOME,
    PRECO_VENDA_PIX,
    PRECO_VENDA_DEBITO,
    PRECO_VENDA_CREDITO,
    FRETE_GRATIS,
    ID_DISTRIBUIDOR
FROM dbo.PRODUTOS
WHERE SITUACAO_REGISTRO = 'ATIVO';
GO

PRINT '✅ VIEW PRODUTOS corrigida com sucesso!';
GO
